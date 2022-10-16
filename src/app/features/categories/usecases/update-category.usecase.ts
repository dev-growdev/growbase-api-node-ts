import { CategoryRepository } from '@categories/repositories';
import { FileDTO, CategoryDTO } from '@models/.';
import { AwsService } from '@shared/external';
import { Result } from '@shared/utils';

interface UpdateCategoryDTO {
  uid: string;
  name: string;
  description?: string;
  image: FileDTO;
}

export class UpdateCategory {
  readonly #categoryRepository: CategoryRepository;
  readonly #awsService: AwsService;

  constructor(categoryRepository: CategoryRepository, awsService: AwsService) {
    this.#categoryRepository = categoryRepository;
    this.#awsService = awsService;
  }

  async execute(categoryData: UpdateCategoryDTO): Promise<Result<CategoryDTO>> {
    if (!categoryData.image.uid) {
      const key = await this.#awsService.upload(categoryData.image.url);
      categoryData.image.url = key;
    }

    const category = await this.#categoryRepository.updateCategory(categoryData);
    return Result.success(category.toJson());
  }
}
