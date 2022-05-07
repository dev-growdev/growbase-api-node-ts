import {
  ProfileDataEntity,
  ServiceProviderEntity,
  ServiceProviderUserEntity,
  UserEntity,
} from '@shared/infra/data/database/entities';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ETypeProfile } from '@shared/domain/enums';
import { CreateAccountRepository } from '@authentication/domain/contracts';
import { AccountRepository } from '@authentication/infra/data/repositories';
import { AccountDTO } from '@authentication/domain/dtos';
import { AccountDtoBuilder } from '@builders/authentication';

const makeAccount = (): AccountDTO => AccountDtoBuilder.init().builder();

const makeSut = (): CreateAccountRepository => {
  return new AccountRepository();
};

const clearEntities = async (): Promise<void> => {
  await pgHelper.client.manager.clear(ServiceProviderUserEntity);
  await pgHelper.client.manager.clear(ServiceProviderEntity);
  await pgHelper.client.manager.clear(UserEntity);
  await pgHelper.client.manager.clear(ProfileDataEntity);
};

describe('CreateAccount Repository', () => {
  beforeAll(async () => {
    await pgHelper.connect();
  });

  afterAll(async () => {
    await clearEntities();
    await pgHelper.disconnect();
  });

  it('should create a user and service provider', async () => {
    const sut = makeSut();
    const account = makeAccount();

    const user = await sut.createAccount(account);

    const manager = pgHelper.client.manager;

    const userDB = (await manager.findOne(UserEntity, {
      where: { login: account.email },
      relations: [
        'profile',
        'serviceProvidersUsers',
        'serviceProvidersUsers.serviceProvider',
        'serviceProvidersUsers.serviceProvider.profile',
      ],
    })) as UserEntity;

    const userProfileDB = userDB.profile as ProfileDataEntity;
    const serviceProviderUserDB = (
      userDB.serviceProvidersUsers as ServiceProviderUserEntity[]
    )[0] as ServiceProviderUserEntity;
    const serviceProviderDB = serviceProviderUserDB.serviceProvider as ServiceProviderEntity;
    const serviceProviderProfileDB = serviceProviderDB.profile as ProfileDataEntity;

    expect(user.uid).toBe(userDB.uid);
    expect(user.uidProfile).toBe(userProfileDB.uid);

    expect(userDB.login).toBe(account.email);
    expect(userDB.verified).toBeFalsy();
    expect(userDB.enable).toBeTruthy();

    expect(userProfileDB.name).toBe(account.name);
    expect(userProfileDB.email).toBe(account.email);
    expect(userProfileDB.document).toBe(account.document);
    expect(userProfileDB.typeProfile).toBe(ETypeProfile.PF);

    expect(user.serviceProviders).toHaveLength(1);
    expect(user.serviceProviders[0].uid).toBe(serviceProviderDB.uid);
    expect(user.serviceProviders[0].uidProfile).toBe(serviceProviderProfileDB.uid);

    expect(serviceProviderProfileDB.name).toBe(account.companyName);
    expect(serviceProviderProfileDB.typeProfile).toBe(ETypeProfile.PJ);
  });
});
