import { Column, Entity } from 'typeorm';
import { EntityBase } from '.';

@Entity({ name: 'files' })
export class FileEntity extends EntityBase {
  @Column()
  name!: string;

  @Column({})
  key!: string;
}
