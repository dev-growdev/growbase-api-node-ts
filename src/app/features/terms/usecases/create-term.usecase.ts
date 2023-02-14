import { Result } from '@shared/utils';
import { TermDTO } from '../dtos';
import { TermRepository } from '../repositories';

export class CreateTerm {
  readonly #repository: TermRepository;

  constructor(repository: TermRepository) {
    this.#repository = repository;
  }

  async execute(dto: TermDTO): Promise<Result<void>> {
    await this.#repository.createTerm(dto);
    return Result.success();
  }
}
