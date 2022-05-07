import { Controller, HttpRequest, HttpResponse } from '@shared/presentation/contracts';
import { notOk, ok, serverError } from '@shared/presentation/helpers';
import { AuthenticationCommand } from '@authentication/domain/commands';
import { Authentication } from '@authentication/domain/usecases';

export class SignInController implements Controller {
  #authentication: Authentication;

  constructor(authentication: Authentication) {
    this.#authentication = authentication;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const command = new AuthenticationCommand({
        login: req.body.login,
        password: req.body.password,
      });

      const result = await this.#authentication.execute(command);

      if (!result.success) return notOk(result);

      return ok(result);
    } catch (error: any) {
      return serverError('handle -> SignInController', error);
    }
  }
}
