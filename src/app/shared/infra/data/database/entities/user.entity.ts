import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { EntityBase, ProfileDataEntity, ServiceProviderUserEntity } from '.';

@Entity({ name: 'users' })
export class UserEntity extends EntityBase {
  @Column()
  login!: string;

  @Column()
  password!: string;

  @Column()
  enable!: boolean;

  @Column()
  verified!: boolean;

  @Column({ name: 'uid_profile' })
  uidProfile!: string;

  @OneToOne(() => ProfileDataEntity)
  @JoinColumn({ name: 'uid_profile', referencedColumnName: 'uid' })
  profile?: ProfileDataEntity;

  @OneToMany(() => ServiceProviderUserEntity, (type) => type.user)
  serviceProvidersUsers?: ServiceProviderUserEntity[];
}
