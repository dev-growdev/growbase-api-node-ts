import { pgHelper } from '@shared/database/connections/pg-helper';
import { User, CredentialUser } from '@models/.';
import { ProfileDataEntity, UserEntity } from '@shared/database/entities';

interface AccountDTO {
  name: string;
  email: string;
  document: string;
  password: string;
}

export class AccountRepository {
  async loadUserByLogin(login: string): Promise<User | undefined> {
    const manager = pgHelper.client.manager;

    const userEntity = await manager.findOne(UserEntity, {
      where: { login },
      relations: ['profileEntity'],
    });

    if (!userEntity) return undefined;

    const user = new User({
      userUid: userEntity.uid,
      profileUid: userEntity.profile.uid,
      name: userEntity.profile.name,
      email: userEntity.profile.email,
      document: userEntity.profile.document,
    });

    user.addCredential(
      new CredentialUser({
        login: userEntity.login,
        password: userEntity.password,
        enable: userEntity.enable,
        verified: userEntity.verified,
      }),
    );

    return user;
  }

  async checkUserByLogin(login: string): Promise<boolean> {
    const manager = pgHelper.client.manager;
    const user = await manager.findOne(UserEntity, { where: { login } });
    return !!user;
  }

  async createAccount({ name, email, password, document }: AccountDTO): Promise<User> {
    await pgHelper.openTransaction();

    try {
      const manager = pgHelper.queryRunner.manager;

      // cria usuário
      const profileEntity = manager.create(ProfileDataEntity, {
        name,
        email,
        document,
      });

      await manager.save(profileEntity);

      const userEntity = manager.create(UserEntity, {
        login: email,
        password,
        enable: true,
        verified: false,
        profileUid: profileEntity.uid,
      });

      await manager.save(userEntity);

      await pgHelper.commit();

      const user = new User({
        userUid: userEntity.uid,
        profileUid: profileEntity.uid,
        name: profileEntity.name,
        email: profileEntity.email,
        document: profileEntity.document,
      });

      return user;
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    }
  }

  async verifyAccount(userUid: string): Promise<void> {
    const manager = pgHelper.client.manager;

    await manager.update(UserEntity, { uid: userUid }, { verified: true });

    return;
  }
}
