import { CreateProductCommand } from '@products/domain/commands';
import { CreateProductRepository } from '@products/domain/contracts/repositories';
import { Product } from '@products/domain/models';
import { CreateProduct, CreateProductImp } from '@products/domain/usecases';
import { CreateProductCommandBuilder, ProductBuilder } from '@builders/products';
import { Result } from '@shared/utils';
import { ApplicationErrorBuilder } from '@builders/shared';

const makeCommand = (): CreateProductCommand => {
  return CreateProductCommandBuilder.init().builder();
};

const makeProductRepository = (): CreateProductRepository => {
  class ProductRepositoryMock implements CreateProductRepository {
    createProduct(): Promise<Product> {
      return Promise.resolve(ProductBuilder.init().builder());
    }
  }

  return new ProductRepositoryMock();
};

interface SutTypes {
  sut: CreateProduct;
  productRepository: CreateProductRepository;
}
const makeSut = (): SutTypes => {
  const productRepository = makeProductRepository();
  const sut = new CreateProductImp(productRepository);

  return { sut, productRepository };
};

describe('CreateProduct UseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.resetAllMocks());

  it('should return 400 if command is invalid', async () => {
    const { sut } = makeSut();

    const command = makeCommand();
    command.product.name = undefined as any;

    const response = await sut.execute(command);

    expect(response).toEqual(
      Result.error(
        400,
        ApplicationErrorBuilder.init()
          .withProcess('execute -> CreateProductImp')
          .withMessage('Requisição inválida')
          .withDetails([{ description: 'Este campo é obrigatório', name: 'name' }])
          .builder(),
      ),
    );
  });

  it('should call CreateProductRepository with correct value', async () => {
    const { sut, productRepository } = makeSut();
    const createProduct = jest.spyOn(productRepository, 'createProduct');

    const command = makeCommand();
    await sut.execute(command);

    expect(createProduct).toHaveBeenCalledWith(Object.assign({}, command.product));
  });

  it('should return error if CreateProductRepository throws', async () => {
    const { sut, productRepository } = makeSut();
    jest.spyOn(productRepository, 'createProduct').mockRejectedValue(new Error('any'));

    const promise = sut.execute(makeCommand());

    await expect(promise).rejects.toThrowError(new Error('any'));
  });

  it('should return a Product', async () => {
    const { sut } = makeSut();

    const product = await sut.execute(makeCommand());

    expect(product).toEqual(Result.success(ProductBuilder.init().builder()));
  });
});
