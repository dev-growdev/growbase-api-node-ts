import { pgHelper } from '@shared/database/connections/pg-helper';
import { User, CredentialUser } from '@models/.';
import { UserEntity } from '@shared/database/entities';

export class AuthenticationRepository {
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
}
