import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EntityBase, ServiceProviderEntity } from '.';

@Entity({ name: 'products' })
export class ProductEntity extends EntityBase {
  @Column()
  public name!: string;

  @Column()
  public price!: number;

  @Column()
  public description?: string;

  @Column()
  public type!: string;

  @Column({ name: 'uid_service_provider' })
  public uidServiceProvider!: string;

  @ManyToOne(() => ServiceProviderEntity, (type) => type.products)
  @JoinColumn({ name: 'uid_service_provider', referencedColumnName: 'uid' })
  serviceProvider?: ServiceProviderEntity;
}
