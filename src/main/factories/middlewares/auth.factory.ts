import { JwtAdapter } from '@shared/infra/adapters';
import { AuthMiddleware } from '@shared/presentation/middlewares';
import { appEnvironments } from '@shared/envs';

export const makeAuthMiddleware = (): AuthMiddleware => {
  const jwt = new JwtAdapter(appEnvironments.JWT_SECRET, appEnvironments.JWT_EXPIREIN);
  return new AuthMiddleware(jwt);
};
