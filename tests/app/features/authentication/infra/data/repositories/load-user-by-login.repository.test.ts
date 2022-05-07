import {
  ProfileDataEntity,
  ServiceProviderEntity,
  ServiceProviderUserEntity,
  UserEntity,
} from '@shared/infra/data/database/entities';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { LoadUserByLoginRepository } from '@authentication/domain/contracts';
import { AccountRepository } from '@authentication/infra/data/repositories';
import {
  ProfileDataEntityBuilder,
  ServiceProviderEntityBuilder,
  ServiceProviderUserEntityBuilder,
  UserEntityBuilder,
} from '@builders/shared';

interface DataDB {
  serviceProvider: ServiceProviderEntity;
  serviceProviderProfile: ProfileDataEntity;
  user: UserEntity;
  userProfile: ProfileDataEntity;
  serviceProviderUser: ServiceProviderUserEntity;
}

const makeDataDB = async (): Promise<DataDB> => {
  const userProfile = await ProfileDataEntityBuilder.init().builder();
  const user = await UserEntityBuilder.init(userProfile.uid, userProfile.email).builder();

  const serviceProviderProfile = await ProfileDataEntityBuilder.init().pj().builder();
  const serviceProvider = await ServiceProviderEntityBuilder.init(
    serviceProviderProfile.uid,
  ).builder();

  const serviceProviderUser = await ServiceProviderUserEntityBuilder.init(
    user.uid,
    serviceProvider.uid,
  ).builder();

  return { user, userProfile, serviceProvider, serviceProviderProfile, serviceProviderUser };
};

const makeSut = (): LoadUserByLoginRepository => {
  return new AccountRepository();
};

const clearEntities = async (): Promise<void> => {
  await pgHelper.client.manager.clear(ServiceProviderUserEntity);
  await pgHelper.client.manager.clear(ServiceProviderEntity);
  await pgHelper.client.manager.clear(UserEntity);
  await pgHelper.client.manager.clear(ProfileDataEntity);
};

describe('LoadUserByLogin Repository', () => {
  beforeAll(async () => {
    await pgHelper.connect();
  });

  beforeEach(async () => {
    await clearEntities();
  });

  afterAll(async () => {
    await clearEntities();
    await pgHelper.disconnect();
  });

  it('should return undefined when user not exists', async () => {
    const sut = makeSut();

    const user = await sut.loadUserByLogin('any@email.com.br');

    expect(user).toBeFalsy();
  });

  it('should return ful user when user exists', async () => {
    const sut = makeSut();
    const { user, userProfile, serviceProvider, serviceProviderProfile } = await makeDataDB();

    const userByLogin = await sut.loadUserByLogin(user.login);

    expect(userByLogin).toBeTruthy();

    expect(userByLogin?.uid).toBe(user.uid);
    expect(userByLogin?.uidProfile).toBe(userProfile.uid);
    expect(userByLogin?.name).toBe(userProfile.name);
    expect(userByLogin?.email).toBe(userProfile.email);
    expect(userByLogin?.document).toBe(userProfile.document);
    expect(userByLogin?.auth?.login).toBe(user.login);
    expect(userByLogin?.auth?.enable).toBe(user.enable);
    expect(userByLogin?.auth?.verified).toBe(user.verified);
    expect(userByLogin?.auth?.password).toBe(user.password);
    expect(userByLogin?.serviceProviders[0].uid).toBe(serviceProvider.uid);
    expect(userByLogin?.serviceProviders[0].uidProfile).toBe(serviceProviderProfile.uid);
    expect(userByLogin?.serviceProviders[0].name).toBe(serviceProviderProfile.name);
  });
});
