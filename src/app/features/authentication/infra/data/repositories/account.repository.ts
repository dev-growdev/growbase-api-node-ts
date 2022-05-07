import {
  ProfileDataEntity,
  UserEntity,
  ServiceProviderEntity,
  ServiceProviderUserEntity,
} from '@shared/infra/data/database/entities';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import {
  CheckUserByLoginRepository,
  CreateAccountRepository,
  LoadUserByLoginRepository,
} from '@authentication/domain/contracts';
import { ServiceProvider, User } from '@authentication/domain/models';
import { AccountDTO } from '@authentication/domain/dtos';
import { ETypeProfile } from '@shared/domain/enums';

type Contracts = CreateAccountRepository & CheckUserByLoginRepository & LoadUserByLoginRepository;

export class AccountRepository implements Contracts {
  async loadUserByLogin(email: string): Promise<User | undefined> {
    const repository = await pgHelper.getRepository<UserEntity>(UserEntity);

    const user = await repository.findOne({
      where: { login: email },
      relations: [
        'profile',
        'serviceProvidersUsers',
        'serviceProvidersUsers.serviceProvider',
        'serviceProvidersUsers.serviceProvider.profile',
      ],
    });

    if (!user) return undefined;

    const profile = user.profile as ProfileDataEntity;

    return {
      uid: user.uid,
      uidProfile: profile.uid,
      name: profile.name,
      email: profile.email,
      document: profile.document as string,
      serviceProviders: user.serviceProvidersUsers?.map((spu) => {
        const serviceProvider = spu.serviceProvider as ServiceProviderEntity;
        return {
          uid: serviceProvider.uid,
          uidProfile: serviceProvider.uidProfile,
          name: (serviceProvider.profile as ProfileDataEntity).name,
        };
      }) as ServiceProvider[],
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
        typeProfile: ETypeProfile.PF,
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

      // cria prestador de serviço

      const serviceProviderProfile = query.create(ProfileDataEntity, {
        name: account.companyName,
        email: account.email,
        typeProfile: ETypeProfile.PJ,
      });

      await query.save(serviceProviderProfile);

      const serviceProvider = query.create(ServiceProviderEntity, {
        uidProfile: serviceProviderProfile.uid,
      });

      await query.save(serviceProvider);

      // faz ligação usuário e prestador de serviço
      await query.save(
        query.create(ServiceProviderUserEntity, {
          uidUser: user.uid,
          uidServiceProvider: serviceProvider.uid,
        }),
      );

      await pgHelper.commit();

      return {
        uid: user.uid,
        uidProfile: userProfile.uid,
        name: userProfile.name,
        email: userProfile.email,
        document: userProfile.document as string,
        serviceProviders: [
          {
            uid: serviceProvider.uid,
            uidProfile: serviceProviderProfile.uid,
            name: serviceProviderProfile.name,
          },
        ],
      };
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    } finally {
      await pgHelper.closeTransaction();
    }
  }
}
