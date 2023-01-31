import { CategoryDTO } from '@models/.';
import { Result } from '@shared/utils';
import { CategoryRepository } from '@categories/repositories';

export class DeleteCategory {
  readonly #categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.#categoryRepository = categoryRepository;
  }

  async execute(categoryUid: string): Promise<Result<CategoryDTO>> {
    const category = await this.#categoryRepository.deleteCategory(categoryUid);
    return Result.success(category.toJson());
  }
}
