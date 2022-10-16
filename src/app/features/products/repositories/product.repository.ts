import { CategoryDTO, FileDTO, Product, SimpleUserDTO } from '@models/.';
import { AppError } from '@shared/errors';
import { pgHelper } from '@shared/database/connections/pg-helper';
import {
  CategoryEntity,
  FileEntity,
  ProductCategoryEntity,
  ProductEntity,
  ProductFileEntity,
  UserEntity,
} from '@shared/database/entities';

interface CreateProductDTO {
  name: string;
  description: string;
  createdUserUid: string;
  categories: string[];
  images: {
    key: string;
    isMain: boolean;
  }[];
}

interface UpdateProductDTO {
  uid: string;
  name: string;
  description: string;
  categories: string[];
  images: {
    uid: string;
    key: string;
    isMain: boolean;
  }[];
}

export class ProductRepository {
  async createProduct(productData: CreateProductDTO): Promise<Product> {
    await pgHelper.openTransaction();

    try {
      const manager = pgHelper.queryRunner.manager;

      const userEntity = await manager.findOne(UserEntity, {
        where: { uid: productData.createdUserUid },
        relations: ['profileEntity'],
      });

      if (!userEntity) {
        throw new AppError('Usuário não localizado');
      }

      const productEntity = manager.create(ProductEntity, {
        name: productData.name,
        description: productData.description,
        enable: true,
        createdByUserUid: userEntity.uid,
      });

      await manager.save(productEntity);

      productEntity.createdByUserEntity = userEntity;

      // vincula as categorias
      const productCategoryEntities: ProductCategoryEntity[] = [];

      for await (const categoryUid of productData.categories) {
        const categoryEntity = await manager.findOneBy(CategoryEntity, { uid: categoryUid });

        if (!categoryEntity) {
          throw new AppError('Categoria não encontrada');
        }

        const productCategoryEntity = manager.create(ProductCategoryEntity, {
          categoryUid,
          productUid: productEntity.uid,
        });

        await manager.save(productCategoryEntity);

        productCategoryEntity.categoryEntity = categoryEntity;

        productCategoryEntities.push(productCategoryEntity);
      }

      productEntity.productCategoryEntities = productCategoryEntities;

      // cria e vincula imagens
      const productFileEntities: ProductFileEntity[] = [];

      for await (const image of productData.images) {
        const fileEntity = manager.create(FileEntity, {
          name: image.key,
          key: image.key,
        });

        await manager.save(fileEntity);

        const productFileEntity = manager.create(ProductFileEntity, {
          productUid: productEntity.uid,
          fileUid: fileEntity.uid,
          isMain: image.isMain,
        });

        await manager.save(productFileEntity);

        productFileEntity.fileEntity = fileEntity;
        productFileEntities.push(productFileEntity);
      }

      productEntity.productFileEntities = productFileEntities;

      const productModel = this.mapProductToModel(productEntity);

      await pgHelper.commit();

      return productModel;
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    }
  }

  async updateProduct(productData: UpdateProductDTO): Promise<Product> {
    // Campos editaveis: nome, descricao, categorias, imagem principal, imagens,
    await pgHelper.openTransaction();

    try {
      const manager = pgHelper.queryRunner.manager;

      await manager.update(
        ProductEntity,
        { uid: productData.uid },
        {
          name: productData.name,
          description: productData.description,
        },
      );

      // remove todas as categorias
      await manager.delete(ProductCategoryEntity, { productUid: productData.uid });

      for await (const categoryUid of productData.categories) {
        const categoryEntity = await manager.findOneBy(CategoryEntity, { uid: categoryUid });

        if (!categoryEntity) {
          throw new AppError('Categoria não encontrada');
        }

        const productCategoryEntity = manager.create(ProductCategoryEntity, {
          categoryUid,
          productUid: productData.uid,
        });

        await manager.save(productCategoryEntity);
      }

      const productFileEntities = await manager.find(ProductFileEntity, {
        where: { productUid: productData.uid },
      });

      // remove imagens que nao fazem mais parte
      for (const productFileEntity of productFileEntities) {
        if (!productData.images.some((image) => image.uid === productFileEntity.uid)) {
          await manager.delete(ProductFileEntity, { uid: productFileEntity.uid });
        }
      }

      // cria novas as imagens
      for (const image of productData.images.filter((image) => !image.uid)) {
        const fileEntity = manager.create(FileEntity, {
          name: image.key,
          key: image.key,
        });

        await manager.save(fileEntity);

        const productFileEntity = manager.create(ProductFileEntity, {
          productUid: productData.uid,
          fileUid: fileEntity.uid,
          isMain: image.isMain,
        });

        await manager.save(productFileEntity);
      }

      // atualiza o isMain das imagens que restaram
      for (const image of productData.images.filter((image) => image.uid)) {
        await manager.update(ProductFileEntity, { uid: image.uid }, { isMain: image.isMain });
      }

      const productEntity = await manager.findOne(ProductEntity, {
        where: { uid: productData.uid },
        relations: [
          'productCategoryEntities',
          'productCategoryEntities.categoryEntity',
          'createdByUserEntity',
          'createdByUserEntity.profileEntity',
        ],
      });

      const product = this.mapProductToModel(productEntity as ProductEntity);

      await pgHelper.commit();

      return product;
    } catch (error) {
      pgHelper.rollback();
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
      ],
    });

    return productEntities.map((e) => this.mapProductToModel(e));
  }

  async getProductByUid(productUid: string): Promise<Product | undefined> {
    const manager = pgHelper.client.manager;

    const productEntity = await manager.findOne(ProductEntity, {
      where: { uid: productUid },
      relations: [
        'productCategoryEntities',
        'productCategoryEntities.categoryEntity',
        'createdByUserEntity',
        'createdByUserEntity.profileEntity',
      ],
    });

    if (!productEntity) return undefined;

    return this.mapProductToModel(productEntity);
  }

  async deleteProduct(productUid: string): Promise<Product> {
    const manager = pgHelper.client.manager;

    const productEntity = await manager.findOne(ProductEntity, {
      where: { uid: productUid },
    });

    if (!productEntity) {
      throw new AppError('Produto não encontrado');
    }

    await manager.update(ProductEntity, { uid: productUid }, { enable: false });

    productEntity.enable = false;

    return this.mapProductToModel(productEntity);
  }

  /**
   * PRIVATE METHODS
   */

  private mapProductToModel(entity: ProductEntity): Product {
    return new Product({
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      enable: entity.enable,
      coverImage: this.mapFileToDTO(entity.mainImage),
      images: entity.files.map((f) => this.mapFileToDTO(f)),
      createdUser: entity.createdByUserEntity ? this.mapUserToDTO(entity.createdByUser) : undefined,
      categories: entity.productCategoryEntities
        ? entity.categories.map((c) => this.mapCategoryToDTO(c))
        : undefined,
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
