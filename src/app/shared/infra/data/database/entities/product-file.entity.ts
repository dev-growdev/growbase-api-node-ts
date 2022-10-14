import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { EntityBase, FileEntity, ProductEntity } from '.';

@Entity({ name: 'products_files' })
export class ProductFileEntity extends EntityBase {
  @Column({ name: 'file_uid' })
  public fileUid!: string;

  @Column({ name: 'product_uid' })
  public productUid!: string;

  @ManyToOne(() => ProductEntity, (entity) => entity.productFileEntities)
  @JoinColumn({ name: 'product_uid', referencedColumnName: 'uid' })
  productEntity?: ProductEntity;

  @OneToOne(() => FileEntity)
  @JoinColumn({ name: 'file_uid', referencedColumnName: 'uid' })
  fileEntity?: FileEntity;
}
