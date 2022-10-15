import { CategoryDTO, FileDTO, Product, ProductDTO, SimpleUserDTO } from '@models/.';
import { AppError } from '@shared/errors';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import {
  CategoryEntity,
  FileEntity,
  ProductCategoryEntity,
  ProductEntity,
  ProductFileEntity,
  UserEntity,
} from '@shared/infra/data/database/entities';

export class ProductRepository {
  async createProduct(product: Partial<ProductDTO>): Promise<Product> {
    await pgHelper.openTransaction();

    try {
      const manager = pgHelper.queryRunner.manager;

      const userEntity = await manager.findOne(UserEntity, {
        where: { uid: product.createdUser?.userUid },
        relations: ['profileEntity'],
      });

      if (!userEntity) {
        throw new AppError('Usuário não localizado');
      }

      const productEntity = manager.create(ProductEntity, {
        name: product.name,
        description: product.description,
        enable: true,
        createdByUserUid: product.createdUser?.userUid,
      });

      await manager.save(productEntity);

      productEntity.createdByUserEntity = userEntity;

      // vincula as categorias
      const productCategoryEntities: ProductCategoryEntity[] = [];

      for await (const category of product.categories as CategoryDTO[]) {
        const categoryEntity = await manager.findOneBy(CategoryEntity, { uid: category.uid });

        if (!categoryEntity) {
          throw new AppError('Categoria não encontrada');
        }

        const productCategoryEntity = manager.create(ProductCategoryEntity, {
          categoryUid: category.uid,
          productUid: productEntity.uid,
        });

        await manager.save(productCategoryEntity);

        productCategoryEntity.categoryEntity = categoryEntity;

        productCategoryEntities.push(productCategoryEntity);
      }

      productEntity.productCategoryEntities = productCategoryEntities;

      // cria e vincula imagens
      const productFileEntities: ProductFileEntity[] = [];

      for await (const image of product.images as FileDTO[]) {
        const fileEntity = manager.create(FileEntity, {
          name: image.url,
          key: image.url,
        });

        await manager.save(fileEntity);

        const productFileEntity = manager.create(ProductFileEntity, {
          productUid: productEntity.uid,
          fileUid: fileEntity.uid,
        });

        await manager.save(productFileEntity);

        productFileEntity.fileEntity = fileEntity;
        productFileEntities.push(productFileEntity);
      }

      productEntity.productFileEntities = productFileEntities;

      await pgHelper.commit();

      return this.mapProductToModel(productEntity);
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    const manager = pgHelper.client.manager;

    const productEntities = await manager.find(ProductEntity, {
      relations: [
        'productCategoryEntities',
        'productCategoryEntities.categoryEntity',
        'createdByUserEntity',
        'createdByUserEntity.profileEntity',
        'productFileEntities',
        'productFileEntities.fileEntity',
      ],
    });

    return productEntities.map(this.mapProductToModel);
  }

  private mapProductToModel(entity: ProductEntity): Product {
    return new Product({
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      enable: entity.enable,
      createdUser: {
        userUid: entity.createdByUserUid,
        name: entity.createdByUser.profile.name,
      },
      categories: entity.categories.map((c) => ({
        uid: entity.uid,
        description: entity.description,
        name: entity.name,
        enable: entity.enable,
        image: { uid: c.file.uid, url: c.file.key },
      })),
      images: entity.files.map((f) => ({
        uid: f.uid,
        url: f.key,
      })),
    });
  }

  private mapCategoryToDTO(entity: CategoryEntity): CategoryDTO {
    return {
      uid: entity.uid,
      description: entity.description,
      name: entity.name,
      enable: entity.enable,
      image: this.mapFileToDTO(entity.file),
    };
  }

  private mapFileToDTO(entity: FileEntity): FileDTO {
    return { uid: entity.uid, url: entity.key };
  }

  private mapUserToDTO(entity: UserEntity): SimpleUserDTO {
    return {
      userUid: entity.uid,
      name: entity.profile.name,
    };
  }
}
