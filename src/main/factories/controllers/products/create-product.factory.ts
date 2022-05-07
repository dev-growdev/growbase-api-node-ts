import { Controller } from '@shared/presentation/contracts';
import { CreateProductImp } from '@products/domain/usecases';
import { ProductRepository } from '@products/infra/data/repositories';
import { CreateProductController } from '@products/presentation/controllers';

export const makeCreateProductController = (): Controller => {
  const repository = new ProductRepository();
  const createProduct = new CreateProductImp(repository);
  return new CreateProductController(createProduct);
};
