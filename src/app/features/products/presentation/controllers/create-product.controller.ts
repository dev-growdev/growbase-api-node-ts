import { Controller, HttpRequest, HttpResponse } from '@shared/presentation/contracts';
import { notOk, ok, serverError } from '@shared/presentation/helpers';
import { CreateProductCommand } from '@products/domain/commands';
import { CreateProduct } from '@products/domain/usecases';

export class CreateProductController implements Controller {
  readonly #createProduct: CreateProduct;

  constructor(createProduct: CreateProduct) {
    this.#createProduct = createProduct;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const command = new CreateProductCommand(request.body, request.authenticatedUser);

      const result = await this.#createProduct.execute(command);

      if (!result.success) return notOk(result);

      return ok(result);
    } catch (error: any) {
      return serverError('handle -> CreateProductController', error);
    }
  }
}
