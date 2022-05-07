import { Controller, HttpRequest } from '@shared/presentation/contracts';
import { notOk, ok, serverError } from '@shared/presentation/helpers';
import { CreateProductCommand } from '@products/domain/commands';
import { Product } from '@products/domain/models';
import { CreateProduct } from '@products/domain/usecases';
import { CreateProductController } from '@products/presentation/controllers';
import { ProductBuilder, ProductDtoBuilder } from '@builders/products';
import { ApplicationErrorBuilder, AuthenticatedUserBuilder } from '@builders/shared';
import { Result } from '@shared/utils';

const makeRequest = (): HttpRequest => {
  return {
    body: ProductDtoBuilder.init().builder(),
    params: undefined,
    authenticatedUser: AuthenticatedUserBuilder.init().builder(),
  };
};

const makeCreateProduct = (): CreateProduct => {
  class CreateProductMock implements CreateProduct {
    execute(): Promise<Result<Product>> {
      return Promise.resolve(Result.success(ProductBuilder.init().builder()));
    }
  }
  return new CreateProductMock();
};

interface SutTypes {
  sut: Controller;
  usecase: CreateProduct;
}
const makeSut = (): SutTypes => {
  const usecase = makeCreateProduct();
  const sut = new CreateProductController(usecase);
  return { sut, usecase };
};

describe('CreateProduct Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should call CreateProduct with correct values', async () => {
    const { sut, usecase } = makeSut();
    const createProductSpy = jest.spyOn(usecase, 'execute');
    const request = makeRequest();

    await sut.handle(request);

    const command = new CreateProductCommand(request.body, request.authenticatedUser);
    command.validate();

    expect(createProductSpy).toBeCalledWith(command);
  });

  it("should return any http request code when result's usecase is invalid", async () => {
    const { sut, usecase } = makeSut();

    jest
      .spyOn(usecase, 'execute')
      .mockResolvedValue(Result.error(400, ApplicationErrorBuilder.init().builder()));

    const httpRequest = makeRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(notOk(Result.error(400, ApplicationErrorBuilder.init().builder())));
  });

  it('should return 200 with user', async () => {
    const { sut } = makeSut();
    const httpRequest = makeRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(ok(Result.success(ProductBuilder.init().builder())));
  });

  it('should return 500 if throw any exception', async () => {
    const { sut, usecase } = makeSut();

    const error = new Error('any_error');
    error.stack = 'any_stack';
    jest.spyOn(usecase, 'execute').mockRejectedValue(error);

    const httpRequest = makeRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(serverError('handle -> CreateProductController', error));
  });
});
