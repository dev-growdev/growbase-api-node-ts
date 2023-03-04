import { Entity, Column } from 'typeorm';
import { EntityBase } from '.';

@Entity({ name: 'faqs' })
export class FaqEntity extends EntityBase {
  @Column()
  question!: string;

  @Column()
  answer!: string;
}
