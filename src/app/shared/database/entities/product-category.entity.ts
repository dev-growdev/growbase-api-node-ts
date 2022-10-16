import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CategoryEntity, EntityBase, ProductEntity } from '.';

@Entity({ name: 'products_categories' })
export class ProductCategoryEntity extends EntityBase {
  @Column({ name: 'category_uid' })
  public categoryUid!: string;

  @Column({ name: 'product_uid' })
  public productUid!: string;

  @ManyToOne(() => ProductEntity, (entity) => entity.productCategoryEntities)
  @JoinColumn({ name: 'product_uid', referencedColumnName: 'uid' })
  productEntity?: ProductEntity;

  @ManyToOne(() => CategoryEntity, (entity) => entity.productCategoryEntities)
  @JoinColumn({ name: 'category_uid', referencedColumnName: 'uid' })
  categoryEntity?: CategoryEntity;
}
