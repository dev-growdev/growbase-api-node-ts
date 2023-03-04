import { FaqModel } from '@models/.';
import { FaqRepository } from '@faqs/repositories';
import { Result } from '@shared/utils';

export class GetAllFaqs {
  readonly #faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.#faqRepository = faqRepository;
  }

  async execute(): Promise<Result<FaqModel[]>> {
    const faqs = await this.#faqRepository.getAllFaqs();
    return Result.success(faqs.map((faq) => faq.toJson()));
  }
}
