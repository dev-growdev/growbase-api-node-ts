import { Term } from '@models/term.model';
import { pgHelper } from '@shared/database/connections/pg-helper';
import { TermEntity } from '@shared/database/entities';
import { Not } from 'typeorm';
import { TermDTO } from '../dtos';

export class TermRepository {
  async createTerm(dto: TermDTO): Promise<void> {
    const manager = pgHelper.client.manager;

    const termCreated = manager.create(TermEntity, {
      title: dto.title,
      content: dto.content,
      version: dto.version,
      enable: dto.enable,
    });

    await manager.save(termCreated);

    await manager.update(
      TermEntity,
      { uid: Not(termCreated.uid), title: termCreated.title },
      { enable: false },
    );

    return;
  }

  async checkIfTermAlreadyExists(termTitle: string): Promise<boolean> {
    const manager = pgHelper.client.manager;

    const termAlreadyExists = await manager.findOne(TermEntity, {
      where: { title: termTitle },
    });

    return !!termAlreadyExists;
  }

  async getTerm(title: string): Promise<Term | undefined> {
    const manager = pgHelper.client.manager;

    const term = await manager.find(TermEntity, {
      where: { title },
      order: { createdAt: 'DESC' },
    });

    if (term.length === 0) return undefined;

    return {
      uid: term[0].uid,
      title: term[0].title,
      content: term[0].content,
      enable: term[0].enable,
      version: term[0].version,
    };
  }
}
