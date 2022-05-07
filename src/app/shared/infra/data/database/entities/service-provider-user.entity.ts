import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EntityBase, ServiceProviderEntity, UserEntity } from '.';

@Entity({ name: 'service_providers_users' })
export class ServiceProviderUserEntity extends EntityBase {
  @Column({ name: 'uid_user' })
  uidUser!: string;

  @Column({ name: 'uid_service_provider' })
  uidServiceProvider!: string;

  @ManyToOne(() => UserEntity, (type) => type.serviceProvidersUsers)
  @JoinColumn({ name: 'uid_user', referencedColumnName: 'uid' })
  user?: UserEntity;

  @ManyToOne(() => ServiceProviderEntity, (type) => type.serviceProvidersUsers)
  @JoinColumn({ name: 'uid_service_provider', referencedColumnName: 'uid' })
  serviceProvider?: ServiceProviderEntity;
}
