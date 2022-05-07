import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AddressEntity, EntityBase } from '.';

@Entity({ name: 'profiles_data' })
export class ProfileDataEntity extends EntityBase {
  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone?: string;

  @Column()
  document?: string;

  @Column({ name: 'type_profile' })
  typeProfile!: string;

  @Column({ name: 'uid_file' })
  uidFile?: string;

  @Column({ name: 'uid_address' })
  uidAddress?: string;

  @OneToOne(() => AddressEntity)
  @JoinColumn({ name: 'uid_address', referencedColumnName: 'uid' })
  address?: AddressEntity;
}
