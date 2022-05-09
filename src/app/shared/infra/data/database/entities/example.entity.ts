import { Column, Entity } from 'typeorm';
import { EntityBase } from '.';

@Entity({ name: 'examples' })
export class ExampleEntity extends EntityBase {
  @Column()
  public name!: string;

  @Column()
  public description?: string;
}
