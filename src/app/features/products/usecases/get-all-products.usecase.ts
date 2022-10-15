import { ProductDTO } from '@models/product.model';
import { ProductRepository } from '@products/repositories';
import { Result } from '@shared/utils';

export class GetAllProducts {
  readonly #productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.#productRepository = productRepository;
  }

  async execute(): Promise<Result<ProductDTO[]>> {
    const products = await this.#productRepository.getAllProducts();
    return Result.success(products.map((product) => product.toJson()));
  }
}
