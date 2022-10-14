import { Category, CategoryDTO } from '@models/.';
import { AppError } from '@shared/errors';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { CategoryEntity, FileEntity } from '@shared/infra/data/database/entities';

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

  async createCategory(category: Partial<CategoryDTO>): Promise<Category> {
    await pgHelper.openTransaction();

    const manager = pgHelper.queryRunner.manager;

    try {
      const fileEntity = manager.create(FileEntity, {
        name: category.image?.url,
        key: category.image?.url,
      });

      await manager.save(FileEntity, fileEntity);

      const categoryEntity = manager.create(CategoryEntity, {
        name: category.name,
        description: category.description,
        fileUid: fileEntity.uid,
        enable: true,
      });

      await manager.save(categoryEntity);

      await pgHelper.commit();

      categoryEntity.fileEntity = fileEntity;

      return this.mapToModel(categoryEntity);
    } catch (error) {
      await pgHelper.rollback();
      throw error;
    }
  }

  async updateCategory(category: Category): Promise<Category> {
    await pgHelper.openTransaction();

    const manager = pgHelper.queryRunner.manager;

    try {
      if (!category.image.uid) {
        const fileEntity = manager.create(FileEntity, {
          name: category.image.url,
          key: category.image.url,
        });

        await manager.save(fileEntity);

        category.updateImage(fileEntity.uid, fileEntity.key);
      }

      await manager.update(
        CategoryEntity,
        { uid: category.uid },
        {
          name: category.name,
          description: category.description,
          fileUid: category.image.uid,
        },
      );

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
      return this.mapToModel(categoryEntity);
    }

    await manager.delete(CategoryEntity, { uid: categoryUid });
    return this.mapToModel(categoryEntity);
  }

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
