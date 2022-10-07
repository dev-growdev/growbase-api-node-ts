import { ProfileDataEntity, UserEntity } from '@shared/infra/data/database/entities';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { AccountDTO, CpfCnpjDTO, CredentialUserDTO } from '@authentication/dtos';
import { User } from '@authentication/models';

export class AccountRepository {
  async loadUserByLogin(login: string): Promise<User | undefined> {
    const manager = pgHelper.client.manager;

    const userDB = await manager.findOne(UserEntity, {
      where: { login },
      relations: ['profile'],
    });

    if (!userDB) return undefined;

    const profileDB = userDB.profile as ProfileDataEntity;

    const user = new User({
      userUid: userDB.uid,
      profileUid: profileDB.uid,
      name: profileDB.name,
      email: profileDB.email,
      document: profileDB.document ? new CpfCnpjDTO(profileDB.document) : undefined,
      credential: new CredentialUserDTO({
        login: userDB.login,
        password: userDB.password,
        enable: userDB.enable,
        verified: userDB.verified,
      }),
    });

    return user;
  }

  async checkUserByLogin(login: string): Promise<boolean> {
    const manager = pgHelper.client.manager;
    const user = await manager.findOne(UserEntity, { where: { login } });
    return !!user;
  }

  async createAccount(account: AccountDTO): Promise<User> {
    await pgHelper.openTransaction();

    try {
      const manager = pgHelper.queryRunner.manager;

      // cria usuário
      const profileDB = manager.create(ProfileDataEntity, {
        name: account.name,
        email: account.email,
        document: account.document.value,
      });

      await manager.save(profileDB);

      const userDB = manager.create(UserEntity, {
        login: account.email,
        password: account.password,
        enable: true,
        verified: false,
        uidProfile: profileDB.uid,
      });

      await manager.save(userDB);

      await pgHelper.commit();

      const user = new User({
        userUid: userDB.uid,
        profileUid: profileDB.uid,
        name: profileDB.name,
        email: profileDB.email,
        document: profileDB.document ? new CpfCnpjDTO(profileDB.document) : undefined,
      });

      return user;
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    }
  }
}
