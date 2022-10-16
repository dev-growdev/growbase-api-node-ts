import { FileDTO, CategoryDTO } from '@models/.';
import { AwsService } from '@shared/external';
import { Result } from '@shared/utils';
import { CategoryRepository } from '@categories/repositories';

export interface CreateCategoryDTO {
  name: string;
  description: string;
  image: FileDTO;
}

export class CreateCategory {
  readonly #categoryRepository: CategoryRepository;
  readonly #awsService: AwsService;

  constructor(categoryRepository: CategoryRepository, awsService: AwsService) {
    this.#categoryRepository = categoryRepository;
    this.#awsService = awsService;
  }

  async execute(categoryData: CreateCategoryDTO): Promise<Result<CategoryDTO>> {
    const image = categoryData.image;
    const fileKey = await this.#awsService.upload(image.url);
    image.url = fileKey;

    categoryData.image = image;

    const category = await this.#categoryRepository.createCategory(categoryData);
    return Result.success(category.toJson());
  }
}
