import { CategoryDTO } from '@models/.';
import { CategoryRepository } from '@categories/repositories/category.repository';
import { Result } from '@shared/utils';

export class GetCategoryByUid {
  readonly #categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.#categoryRepository = categoryRepository;
  }

  async execute(categoryUid: string): Promise<Result<CategoryDTO | undefined>> {
    const category = await this.#categoryRepository.getCategoryByUid(categoryUid);
    return Result.success(category ? category.toJson() : undefined);
  }
}
