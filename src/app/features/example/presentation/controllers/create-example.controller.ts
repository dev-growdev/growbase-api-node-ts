import { CreateExampleCommand } from '@example/domain/commands';
import { CreateExample } from '@example/domain/usecases';
import { Controller, HttpRequest, HttpResponse } from '@shared/presentation/contracts';
import { ok, notOk, serverError } from '@shared/presentation/helpers';

export class CreateExampleController implements Controller {
  readonly #usecase: CreateExample;

  constructor(usecase: CreateExample) {
    this.#usecase = usecase;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const command = new CreateExampleCommand(request.body);

      const result = await this.#usecase.execute(command);

      if (!result.success) return notOk(result);

      return ok(result);
    } catch (error: any) {
      return serverError('handle -> CreateExampleController', error);
    }
  }
}
