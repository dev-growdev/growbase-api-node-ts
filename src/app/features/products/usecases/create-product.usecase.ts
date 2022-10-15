import { FileDTO } from '@models/.';
import { ProductDTO } from '@models/product.model';
import { ProductRepository } from '@products/repositories';
import { AwsService } from '@shared/external';
import { Result } from '@shared/utils';

export class CreateProduct {
  readonly #productRepository: ProductRepository;
  readonly #awsService: AwsService;

  constructor(productRepository: ProductRepository, awsService: AwsService) {
    this.#productRepository = productRepository;
    this.#awsService = awsService;
  }

  async execute(productDto: Partial<ProductDTO>): Promise<Result<ProductDTO>> {
    const images: FileDTO[] = [];

    for await (const image of productDto.images as FileDTO[]) {
      const fileKey = await this.#awsService.upload(image.url);
      images.push({ uid: '', url: fileKey });
    }

    productDto.images = images;

    const product = await this.#productRepository.createProduct(productDto);
    return Result.success(product.toJson());
  }
}
