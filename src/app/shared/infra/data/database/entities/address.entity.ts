import { Column, Entity } from 'typeorm';
import { EntityBase } from '.';

@Entity({ name: 'addresses' })
export class AddressEntity extends EntityBase {
  @Column()
  street!: string;

  @Column()
  number!: string;

  @Column()
  complement?: string;

  @Column({ name: 'post_code' })
  postCode!: string;

  @Column()
  neighborhood!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  latitude?: number;

  @Column()
  longitude?: number;
}
