import { ProfileDataEntity, UserEntity } from '@shared/infra/data/database/entities';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import {
  CheckUserByLoginRepository,
  CreateAccountRepository,
  LoadUserByLoginRepository,
} from '@authentication/domain/contracts';
import { User } from '@authentication/domain/models';
import { AccountDTO } from '@authentication/domain/dtos';

type Contracts = CreateAccountRepository & CheckUserByLoginRepository & LoadUserByLoginRepository;

export class AccountRepository implements Contracts {
  async loadUserByLogin(email: string): Promise<User | undefined> {
    const repository = await pgHelper.getRepository<UserEntity>(UserEntity);

    const user = await repository.findOne({
      where: { login: email },
      relations: ['profile'],
    });

    if (!user) return undefined;

    const profile = user.profile as ProfileDataEntity;

    return {
      uid: user.uid,
      uidProfile: profile.uid,
      name: profile.name,
      email: profile.email,
      document: profile.document as string,
      auth: {
        login: user.login,
        password: user.password,
        enable: user.enable,
        verified: user.verified,
      },
    };
  }

  async checkUserByLogin(email: string): Promise<boolean> {
    const repository = await pgHelper.getRepository<UserEntity>(UserEntity);

    const user = await repository.findOne({ where: { login: email } });

    return user ? true : false;
  }

  async createAccount(account: AccountDTO): Promise<User> {
    await pgHelper.openTransaction();

    try {
      const query = pgHelper.queryRunner.manager;

      // cria usuário
      const userProfile = query.create(ProfileDataEntity, {
        name: account.name,
        email: account.email,
        document: account.document,
      });

      await query.save(userProfile);

      const user = query.create(UserEntity, {
        login: account.email,
        password: account.password,
        enable: true,
        verified: false,
        uidProfile: userProfile.uid,
      });

      await query.save(user);

      await pgHelper.commit();

      return {
        uid: user.uid,
        uidProfile: userProfile.uid,
        name: userProfile.name,
        email: userProfile.email,
        document: userProfile.document as string,
      };
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    } finally {
      await pgHelper.closeTransaction();
    }
  }
}
