import { CategoryDTO } from '@models/.';
import { CategoryRepository } from '@categories/repositories/category.repository';
import { Result } from '@shared/utils';

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
