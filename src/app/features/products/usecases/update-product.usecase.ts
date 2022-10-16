import { ProductDTO } from '@models/.';
import { ProductRepository } from '@products/repositories';
import { AwsService } from '@shared/external';
import { Result } from '@shared/utils';

interface UpdateProductDTO {
  uid: string;
  name: string;
  description: string;
  categories: {
    uid: string;
  }[];
  images: {
    uid: string;
    url: string;
    isMain: boolean;
  }[];
}

interface ImageDTO {
  uid: string;
  key: string;
  isMain: boolean;
}

export class UpdateProduct {
  readonly #productRepository: ProductRepository;
  readonly #awsService: AwsService;

  constructor(productRepository: ProductRepository, awsService: AwsService) {
    this.#productRepository = productRepository;
    this.#awsService = awsService;
  }

  async execute(productData: UpdateProductDTO): Promise<Result<ProductDTO>> {
    const images: ImageDTO[] = [];

    for await (const imageData of productData.images) {
      const image: ImageDTO = {
        uid: imageData.uid,
        key: imageData.url,
        isMain: imageData.isMain,
      };

      if (!imageData.uid) {
        const fileKey = await this.#awsService.upload(imageData.url);
        image.key = fileKey;
      }

      images.push(image);
    }

    // se nenhuma imagem for definida como principal, a primeira é definida
    if (images.some((i) => !i.isMain)) {
      images[0].isMain = true;
    }

    const product = await this.#productRepository.updateProduct({
      uid: productData.uid,
      name: productData.name,
      description: productData.description,
      categories: productData.categories.map((c) => c.uid),
      images: images,
    });

    return Result.success(product.toJson());
  }
}
