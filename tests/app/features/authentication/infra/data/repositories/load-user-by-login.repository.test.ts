import { ProfileDataEntity, UserEntity } from '@shared/database/data/database/entities';
import { pgHelper } from '@shared/database/connections/pg-helper';
import { LoadUserByLoginRepository } from '@authentication/domain/contracts';
import { AccountRepository } from '@authentication/infra/data/repositories';
import { ProfileDataEntityBuilder, UserEntityBuilder } from '@builders/shared';

interface DataDB {
  user: UserEntity;
  userProfile: ProfileDataEntity;
}

const makeDataDB = async (): Promise<DataDB> => {
  const userProfile = await ProfileDataEntityBuilder.init().builder();
  const user = await UserEntityBuilder.init(userProfile.uid, userProfile.email).builder();

  return { user, userProfile };
};

const makeSut = (): LoadUserByLoginRepository => {
  return new AccountRepository();
};

const clearEntities = async (): Promise<void> => {
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
    const { user, userProfile } = await makeDataDB();

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
  });
});
