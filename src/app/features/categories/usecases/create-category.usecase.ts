import { CategoryJson, FileJson } from '@models/.';
import { CategoryRepository } from '@categories/repositories/category.repository';
import { AwsService } from '@shared/external';
import { Result } from '@shared/utils';

export class CreateCategory {
  readonly #categoryRepository: CategoryRepository;
  readonly #awsService: AwsService;

  constructor(categoryRepository: CategoryRepository, awsService: AwsService) {
    this.#categoryRepository = categoryRepository;
    this.#awsService = awsService;
  }

  async execute(categoryDto: Partial<CategoryJson>): Promise<Result<CategoryJson>> {
    const image = categoryDto.image as FileJson;
    const fileKey = await this.#awsService.upload(image.url);
    image.url = fileKey;

    categoryDto.image = image;

    const category = await this.#categoryRepository.createCategory(categoryDto);
    return Result.success(category.toJson());
  }
}
