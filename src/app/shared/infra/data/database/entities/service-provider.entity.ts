import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { EntityBase, ProductEntity, ProfileDataEntity, ServiceProviderUserEntity } from '.';

@Entity({ name: 'service_providers' })
export class ServiceProviderEntity extends EntityBase {
  @Column({ name: 'uid_profile' })
  uidProfile!: string;

  @Column({ name: 'company_type' })
  companyType!: string;

  @OneToOne(() => ProfileDataEntity)
  @JoinColumn({ name: 'uid_profile', referencedColumnName: 'uid' })
  profile?: ProfileDataEntity;

  @OneToMany(() => ServiceProviderUserEntity, (type) => type.serviceProvider)
  serviceProvidersUsers?: ServiceProviderUserEntity[];

  @OneToMany(() => ProductEntity, (type) => type.serviceProvider)
  products?: ProductEntity[];
}
