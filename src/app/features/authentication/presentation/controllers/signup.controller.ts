import { Controller, HttpRequest, HttpResponse } from '@shared/presentation/contracts';
import { notOk, ok, serverError } from '@shared/presentation/helpers';
import { CreateAccountCommand } from '@authentication/domain/commands';
import { CreateAccount } from '@authentication/domain/usecases';

export class SignUpController implements Controller {
  #createAccount: CreateAccount;

  constructor(createAccount: CreateAccount) {
    this.#createAccount = createAccount;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const command = new CreateAccountCommand(req.body);

      const result = await this.#createAccount.execute(command);

      if (!result.success) return notOk(result);

      return ok(result);
    } catch (error: any) {
      return serverError('handle -> SignUpController', error);
    }
  }
}
