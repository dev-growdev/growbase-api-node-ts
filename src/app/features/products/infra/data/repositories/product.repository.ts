import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ProductEntity } from '@shared/infra/data/database/entities';
import { CreateProductRepository } from '@products/domain/contracts/repositories';
import { ProductDTO } from '@products/domain/dtos';
import { Product } from '@products/domain/models';

export class ProductRepository implements CreateProductRepository {
  async createProduct(product: ProductDTO): Promise<Product> {
    const repository = await pgHelper.getRepository(ProductEntity);

    const createdProduct = repository.create({
      name: product.name,
      type: product.type,
      uidServiceProvider: product.uidServiceProvider,
      description: product.description,
      price: product.price,
    });

    await repository.save(createdProduct);

    return {
      uid: createdProduct.uid,
      name: createdProduct.name,
      description: createdProduct.description,
      serviceProvider: { uid: product.uidServiceProvider },
      type: createdProduct.type,
      price: createdProduct.price,
    };
  }
}
