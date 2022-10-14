import { CategoryRepository } from '@categories/repositories/category.repository';
import { Category, CategoryJson } from '@models/.';
import { AwsService } from '@shared/external';
import { Result } from '@shared/utils';

export class UpdateCategory {
  readonly #categoryRepository: CategoryRepository;
  readonly #awsService: AwsService;

  constructor(categoryRepository: CategoryRepository, awsService: AwsService) {
    this.#categoryRepository = categoryRepository;
    this.#awsService = awsService;
  }

  async execute(categoryToUpdate: Category): Promise<Result<CategoryJson>> {
    if (!categoryToUpdate.image.uid) {
      const key = await this.#awsService.upload(categoryToUpdate.image.url);
      categoryToUpdate.addNewImage(key);
    }

    const category = await this.#categoryRepository.updateCategory(categoryToUpdate);
    return Result.success(category.toJson());
  }
}
