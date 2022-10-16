import { AppError } from '../../errors';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { EntityBase, FileEntity, ProductCategoryEntity, ProductEntity } from '.';

@Entity({ name: 'categories' })
export class CategoryEntity extends EntityBase {
  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column()
  enable!: boolean;

  @Column({ name: 'file_uid' })
  fileUid!: string;

  @OneToMany(() => ProductCategoryEntity, (entity) => entity.categoryEntity)
  productCategoryEntities?: ProductCategoryEntity[];

  @OneToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: 'file_uid', referencedColumnName: 'uid' })
  fileEntity!: FileEntity;

  get products(): ProductEntity[] {
    if (
      !this.productCategoryEntities ||
      this.productCategoryEntities.some((e) => !!e.productEntity)
    ) {
      throw new AppError('Produtos não carregado na entidade');
    }

    return this.productCategoryEntities.map((e) => e.productEntity as ProductEntity);
  }

  get file(): FileEntity {
    if (!this.fileEntity) {
      throw new AppError('Arquivo não carregado na entidade');
    }
    return this.fileEntity;
  }
}
