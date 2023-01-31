import { ProductDTO } from '@models/.';
import { ProductRepository } from '@products/repositories';
import { AwsService } from '@shared/external';
import { Result } from '@shared/utils';

interface CreateProductDTO {
  name: string;
  description: string;
  createdUserUid: string;
  categories: {
    uid: string;
  }[];
  images: {
    url: string;
    isMain: boolean;
  }[];
}

export class CreateProduct {
  readonly #productRepository: ProductRepository;
  readonly #awsService: AwsService;

  constructor(productRepository: ProductRepository, awsService: AwsService) {
    this.#productRepository = productRepository;
    this.#awsService = awsService;
  }

  async execute(productData: CreateProductDTO): Promise<Result<ProductDTO>> {
    const images: { key: string; isMain: boolean }[] = [];

    for await (const image of productData.images) {
      const fileKey = await this.#awsService.upload(image.url);
      images.push({
        key: fileKey,
        isMain: image.isMain,
      });
    }

    // se nenhuma imagem for definida como principal, a primeira é definida
    if (images.some((i) => !i.isMain)) {
      images[0].isMain = true;
    }

    const product = await this.#productRepository.createProduct({
      name: productData.name,
      description: productData.description,
      createdUserUid: productData.createdUserUid,
      categories: productData.categories.map((c) => c.uid),
      images: images,
    });

    return Result.success(product.toJson());
  }
}
