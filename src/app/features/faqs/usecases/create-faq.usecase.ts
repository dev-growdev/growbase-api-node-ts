import { FaqDTO } from '@faqs/dtos';
import { Result } from '@shared/utils';
import { FaqRepository } from '@faqs/repositories';
import { FaqModel } from '@models/faq.model';

export class CreateFaq {
  readonly #faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.#faqRepository = faqRepository;
  }

  async execute(dto: FaqDTO): Promise<Result<FaqModel>> {
    const faq = await this.#faqRepository.createFaq(dto);
    return Result.success(faq.toJson());
  }
}
