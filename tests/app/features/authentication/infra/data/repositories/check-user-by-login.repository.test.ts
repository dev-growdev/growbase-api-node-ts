import { ProfileDataEntity, UserEntity } from '@shared/infra/data/database/entities';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { CheckUserByLoginRepository } from '@authentication/domain/contracts';
import { AccountRepository } from '@authentication/infra/data/repositories';
import { ProfileDataEntityBuilder, UserEntityBuilder } from '@builders/shared';

const makeUserDB = async (): Promise<UserEntity> => {
  const profile = await ProfileDataEntityBuilder.init().builder();
  const user = await UserEntityBuilder.init(profile.uid, profile.email).builder();
  user.profile = profile;
  return user;
};

const makeSut = (): CheckUserByLoginRepository => {
  return new AccountRepository();
};

const clearEntities = async (): Promise<void> => {
  await pgHelper.client.manager.clear(UserEntity);
  await pgHelper.client.manager.clear(ProfileDataEntity);
};

describe('CheckUserByLogin Repository', () => {
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

  it('should return false when user not exists', async () => {
    const sut = makeSut();

    const userExists = await sut.checkUserByLogin('any@email.com.br');

    expect(userExists).toBeFalsy();
  });

  it('should return true when user exists', async () => {
    const sut = makeSut();
    const user = await makeUserDB();

    const userExists = await sut.checkUserByLogin(user.login);

    expect(userExists).toBeTruthy();
  });
});
