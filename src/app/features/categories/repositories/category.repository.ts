import { Category, FileDTO } from '@models/.';
import { AppError } from '@shared/errors';
import { pgHelper } from '@shared/database/connections/pg-helper';
import { CategoryEntity, FileEntity } from '@shared/database/entities';

export interface CreateOrUpdateCategoryDTO {
  uid: string;
  name: string;
  description?: string;
  image: FileDTO;
}

export class CategoryRepository {
  async getAllCategories(): Promise<Array<Category>> {
    const manager = pgHelper.client.manager;

    const categories = await manager.find(CategoryEntity);

    return categories.map((category) => this.mapToModel(category));
  }

  async getCategoryByUid(uid: string): Promise<Category | undefined> {
    const manager = pgHelper.client.manager;

    const category = await manager.findOneBy(CategoryEntity, { uid });

    if (!category) return undefined;

    return this.mapToModel(category);
  }

  async createCategory(categoryData: Omit<CreateOrUpdateCategoryDTO, 'uid'>): Promise<Category> {
    await pgHelper.openTransaction();

    const manager = pgHelper.queryRunner.manager;

    try {
      const fileEntity = manager.create(FileEntity, {
        name: categoryData.image?.url,
        key: categoryData.image?.url,
      });

      await manager.save(FileEntity, fileEntity);

      const categoryEntity = manager.create(CategoryEntity, {
        name: categoryData.name,
        description: categoryData.description,
        fileUid: fileEntity.uid,
        enable: true,
      });

      await manager.save(categoryEntity);

      categoryEntity.fileEntity = fileEntity;

      const category = this.mapToModel(categoryEntity);

      await pgHelper.commit();

      return category;
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    }
  }

  async updateCategory(categoryData: CreateOrUpdateCategoryDTO): Promise<Category> {
    await pgHelper.openTransaction();

    const manager = pgHelper.queryRunner.manager;

    try {
      if (!categoryData.image.uid) {
        const fileEntity = manager.create(FileEntity, {
          name: categoryData.image.url,
          key: categoryData.image.url,
        });

        await manager.save(fileEntity);

        categoryData.image.uid = fileEntity.uid;
      }

      await manager.update(
        CategoryEntity,
        { uid: categoryData.uid },
        {
          name: categoryData.name,
          description: categoryData.description,
          fileUid: categoryData.image.uid,
        },
      );

      const categoryEntity = await manager.findOne(CategoryEntity, {
        where: { uid: categoryData.uid },
      });

      const category = this.mapToModel(categoryEntity as CategoryEntity);
      await pgHelper.commit();
      return category;
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    }
  }

  async deleteCategory(categoryUid: string): Promise<Category> {
    const manager = pgHelper.client.manager;

    const categoryEntity = await manager.findOne(CategoryEntity, {
      where: { uid: categoryUid },
      relations: ['productCategoryEntities'],
    });

    if (!categoryEntity) {
      throw new AppError('Categoria não encontrada');
    }

    if (categoryEntity.products.length > 0) {
      await manager.update(CategoryEntity, { uid: categoryUid }, { enable: false });
      categoryEntity.enable = false;
      return this.mapToModel(categoryEntity);
    }

    await manager.delete(CategoryEntity, { uid: categoryUid });
    return this.mapToModel(categoryEntity);
  }

  /**
   * PRIVATE METHODS
   */

  private mapToModel(entity: CategoryEntity): Category {
    return new Category({
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      enable: entity.enable,
      image: {
        uid: entity.file.uid,
        url: entity.file.key,
      },
    });
  }
}
