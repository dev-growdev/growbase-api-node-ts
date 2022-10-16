import { CategoryDTO } from '@models/.';
import { CategoryRepository } from '@categories/repositories';
import { Result } from '@shared/utils';

export class GetAllCategories {
  readonly #categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.#categoryRepository = categoryRepository;
  }

  async execute(): Promise<Result<CategoryDTO[]>> {
    const categories = await this.#categoryRepository.getAllCategories();
    return Result.success(categories.map((category) => category.toJson()));
  }
}
