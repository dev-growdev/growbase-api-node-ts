import { Column, Entity } from 'typeorm';
import { EntityBase } from '.';

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

  @Column({ name: 'uid_file' })
  uidFile?: string;
}
