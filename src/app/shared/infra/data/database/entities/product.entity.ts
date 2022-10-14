import { AppError } from '../../../../errors';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  CategoryEntity,
  EntityBase,
  FileEntity,
  ProductCategoryEntity,
  ProductFileEntity,
  UserEntity,
} from '.';

@Entity({ name: 'products' })
export class ProductEntity extends EntityBase {
  @Column()
  public name!: string;

  @Column()
  public description!: string;

  @Column()
  public enable!: boolean;

  @Column({ name: 'created_by_user_uid' })
  public createdByUserUid!: string;

  @OneToMany(() => ProductCategoryEntity, (entity) => entity.productEntity)
  productCategoryEntities?: ProductCategoryEntity[];

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by_user_uid', referencedColumnName: 'uid' })
  createByUserEntity?: UserEntity;

  @OneToMany(() => ProductFileEntity, (entity) => entity.productEntity)
  productFileEntities?: ProductFileEntity[];

  get categories(): CategoryEntity[] {
    if (
      !this.productCategoryEntities ||
      this.productCategoryEntities.some((e) => !!e.categoryEntity)
    ) {
      throw new AppError('Categorias não carregada na entidade');
    }
    return this.productCategoryEntities.map((e) => e.categoryEntity as CategoryEntity);
  }

  get files(): FileEntity[] {
    if (!this.productFileEntities || this.productFileEntities.some((e) => !!e.fileEntity)) {
      throw new AppError('Arquivos não carregado na entidade');
    }
    return this.productFileEntities.map((e) => e.fileEntity as FileEntity);
  }
}
