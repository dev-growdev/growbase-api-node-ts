import { Entity, Column } from 'typeorm';
import { EntityBase } from '.';

@Entity({ name: 'terms' })
export class TermEntity extends EntityBase {
  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  version!: string;

  @Column()
  enable!: boolean;
}
