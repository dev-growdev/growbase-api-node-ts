import { BcryptAdapter } from '@shared/infra/adapters';
import { Controller } from '@shared/presentation/contracts';
import { appEnvironments } from '@shared/envs';
import { CreateAccountImp } from '@authentication/domain/usecases';
import { AccountRepository } from '@authentication/infra/data/repositories';
import { SignUpController } from '@authentication/presentation/controllers';

export const makeSignUpController = (): Controller => {
  const accountRepository = new AccountRepository();
  const bcryptAdapter = new BcryptAdapter(appEnvironments.BCRYPT_SALT);
  const createAccount = new CreateAccountImp(accountRepository, bcryptAdapter);
  return new SignUpController(createAccount);
};
