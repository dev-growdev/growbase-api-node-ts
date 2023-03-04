import { FaqModel } from '@models/.';
import { Result } from '@shared/utils';
import { FaqRepository } from '@faqs/repositories';

export class GetFaqByUid {
  readonly #faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.#faqRepository = faqRepository;
  }

  async execute(uid: string): Promise<Result<FaqModel | undefined>> {
    const faq = await this.#faqRepository.getFaqByUid(uid);
    return Result.success(faq?.toJson());
  }
}
