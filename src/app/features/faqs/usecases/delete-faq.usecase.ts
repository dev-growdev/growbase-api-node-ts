import { Result } from '@shared/utils';
import { FaqRepository } from '@faqs/repositories';

export class DeleteFaq {
  readonly #faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.#faqRepository = faqRepository;
  }

  async execute(uid: string): Promise<Result<void>> {
    await this.#faqRepository.deleteFaq(uid);
    return Result.success();
  }
}
