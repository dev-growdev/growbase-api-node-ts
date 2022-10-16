import { ProductDTO } from '@models/.';
import { ProductRepository } from '@products/repositories';
import { Result } from '@shared/utils';

export class GetProductByUid {
  readonly #productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.#productRepository = productRepository;
  }

  async execute(productUid: string): Promise<Result<ProductDTO>> {
    const product = await this.#productRepository.getProductByUid(productUid);
    return Result.success(product?.toJson());
  }
}
