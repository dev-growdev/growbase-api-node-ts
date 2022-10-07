import { ProfileDataEntity, UserEntity } from '@shared/infra/data/database/entities';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { CreateAccountRepository } from '@authentication/domain/contracts';
import { AccountRepository } from '@authentication/infra/data/repositories';
import { AccountDTO } from '@authentication/dtos';
import { AccountDtoBuilder } from '@builders/authentication';

const makeAccount = (): AccountDTO => AccountDtoBuilder.init().builder();

const makeSut = (): CreateAccountRepository => {
  return new AccountRepository();
};

const clearEntities = async (): Promise<void> => {
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
      relations: ['profile'],
    })) as UserEntity;

    const userProfileDB = userDB.profile as ProfileDataEntity;

    expect(user.uid).toBe(userDB.uid);
    expect(user.uidProfile).toBe(userProfileDB.uid);

    expect(userDB.login).toBe(account.email);
    expect(userDB.verified).toBeFalsy();
    expect(userDB.enable).toBeTruthy();

    expect(userProfileDB.name).toBe(account.name);
    expect(userProfileDB.email).toBe(account.email);
    expect(userProfileDB.document).toBe(account.document);
  });
});
