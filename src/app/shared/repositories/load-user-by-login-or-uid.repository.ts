import { CredentialUser } from '@models/credential-user.model';
import { User } from '@models/user.model';
import { pgHelper } from '@shared/database/connections/pg-helper';
import { UserEntity } from '@shared/database/entities';

interface LoadUserByLoginOrUidDTO {
  login?: string;
  uid?: string;
}

export class LoadUserByLoginOrUidRepository {
  async loadUser(dto: LoadUserByLoginOrUidDTO): Promise<User | undefined> {
    const manager = pgHelper.client.manager;

    const userEntity = await manager.findOne(UserEntity, {
      where: [
        {
          login: dto.login,
        },
        {
          uid: dto.uid,
        },
      ],
      relations: ['profileEntity', 'userRoleEntity'],
    });

    if (!userEntity) return undefined;

    const user = new User({
      userUid: userEntity.uid,
      profileUid: userEntity.profile.uid,
      userRoleUid: userEntity.userRole.uid,
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
