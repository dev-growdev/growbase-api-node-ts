import { format } from 'date-fns';
import { redisHelper } from '@shared/infra/data/connections/redis-helper';
import { Controller, HttpRequest, HttpResponse, Middleware } from '@shared/presentation/contracts';

export class LogErrorDecorator implements Controller {
  readonly #controller: Controller | Middleware;

  constructor(controller: Controller | Middleware) {
    this.#controller = controller;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const response = await this.#controller.handle(request);

    if (response.statusCode === 500) {
      await redisHelper.set(
        `error:${format(new Date(), 'dd/MM/yyyy')}-${new Date().getTime()}`,
        response,
      );
    }

    return response;
  }
}
