import { Faq } from '@models/faq.model';
import { FaqDTO } from '@faqs/dtos';
import { pgHelper } from '@shared/database/connections/pg-helper';
import { FaqEntity } from '@shared/database/entities';
import { AppError } from '@shared/errors';

export class FaqRepository {
  async getAllFaqs(): Promise<Faq[]> {
    const manager = pgHelper.client.manager;

    const faqs = await manager.find(FaqEntity);

    return faqs.map((faq) => this.mapToModel(faq));
  }

  async getFaqByUid(uid: string): Promise<Faq | undefined> {
    const manager = pgHelper.client.manager;

    const faq = await manager.findOne(FaqEntity, { where: { uid } });

    if (!faq) return undefined;

    return this.mapToModel(faq);
  }

  async createFaq(dto: FaqDTO): Promise<Faq> {
    const manager = pgHelper.client.manager;

    const faqEntity = manager.create(FaqEntity, {
      question: dto.question,
      answer: dto.answer,
    });

    await manager.save(faqEntity);

    return this.mapToModel(faqEntity);
  }

  async updateFaq(uid: string, dto: FaqDTO): Promise<Faq> {
    const manager = pgHelper.client.manager;

    await manager.update(
      FaqEntity,
      {
        uid,
      },
      { question: dto.question, answer: dto.answer },
    );

    const faqEntity = await manager.findOne(FaqEntity, { where: { uid } });

    return this.mapToModel(faqEntity as FaqEntity);
  }

  async deleteFaq(uid: string): Promise<void> {
    const manager = pgHelper.client.manager;

    const faqEntity = await manager.findOne(FaqEntity, {
      where: { uid },
    });

    if (!faqEntity) {
      throw new AppError('Faq não encontrada');
    }

    await manager.delete(FaqEntity, { uid: faqEntity.uid });

    return;
  }

  // PRIVATE METHODS
  private mapToModel(entity: FaqEntity): Faq {
    return new Faq({
      uid: entity.uid,
      question: entity.question,
      answer: entity.answer,
    });
  }
}
