import { FaqDTO } from '@faqs/dtos';
import { Result } from '@shared/utils';
import { FaqRepository } from '@faqs/repositories';
import { FaqModel } from '@models/faq.model';

export class UpdateFaq {
  readonly #faqRepository: FaqRepository;

  constructor(faqRepository: FaqRepository) {
    this.#faqRepository = faqRepository;
  }

  async execute(uid: string, dto: FaqDTO): Promise<Result<FaqModel>> {
    const faq = await this.#faqRepository.updateFaq(uid, dto);
    return Result.success(faq.toJson());
  }
}
