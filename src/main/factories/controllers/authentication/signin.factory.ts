import { BcryptAdapter, JwtAdapter } from '@shared/infra/adapters';
import { Controller } from '@shared/presentation/contracts';
import { appEnvironments } from '@shared/envs';
import { AuthenticationImp } from '@authentication/domain/usecases';
import { AccountRepository } from '@authentication/infra/data/repositories';
import { SignInController } from '@authentication/presentation/controllers';

export const makeSignInController = (): Controller => {
  const accountRepository = new AccountRepository();
  const jwtAdapter = new JwtAdapter(appEnvironments.JWT_SECRET, appEnvironments.JWT_EXPIREIN);
  const bcryptAdapter = new BcryptAdapter(appEnvironments.BCRYPT_SALT);
  const authentication = new AuthenticationImp(accountRepository, bcryptAdapter, jwtAdapter);
  return new SignInController(authentication);
};
