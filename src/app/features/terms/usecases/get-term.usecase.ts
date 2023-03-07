import { Term } from '@models/term.model';
import { Result } from '@shared/utils';
import { TermRepository } from '../repositories';

export class GetTerm {
  readonly #repository: TermRepository;

  constructor(repository: TermRepository) {
    this.#repository = repository;
  }

  async execute(title: string): Promise<Result<Term | undefined>> {
    const term = await this.#repository.getTerm(title);
    return Result.success(term);
  }
}
