import { CategoryRepository } from '@categories/repositories';
import {
  CreateCategory,
  DeleteCategory,
  GetAllCategories,
  GetCategoryByUid,
  UpdateCategory,
} from '@categories/usecases';
import { AwsService } from '@shared/external';
import { notFound, notOk, ok, serverError } from '@shared/utils';
import { Request, Response } from 'express';

export class CategoryController {
  async getAllCategories(request: Request, response: Response) {
    try {
      const getAllCategories = new GetAllCategories(new CategoryRepository());

      const result = await getAllCategories.execute();

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'getAllCategories -> CategoryController', error);
    }
  }

  async getCategoryByUid(request: Request, response: Response) {
    try {
      const { uid } = request.params;

      const getCategoryByUid = new GetCategoryByUid(new CategoryRepository());

      const result = await getCategoryByUid.execute(uid);

      if (!result.success) return notOk(response, result);

      if (!result.data) return notFound(response, 'Categoria não localizada');

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'getCategoryByUid -> CategoryController', error);
    }
  }

  async createCategory(request: Request, response: Response) {
    try {
      const { name, description, image } = request.body;

      const createCategory = new CreateCategory(new CategoryRepository(), new AwsService());

      const result = await createCategory.execute({ name, description, image });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'createCategory -> CategoryController', error);
    }
  }

  async updateCategory(request: Request, response: Response) {
    try {
      const { uid } = request.params;
      const { name, description, image } = request.body;

      const updateCategory = new UpdateCategory(new CategoryRepository(), new AwsService());

      const result = await updateCategory.execute({ uid, name, description, image });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'updateCategory -> CategoryController', error);
    }
  }

  async deleteCategory(request: Request, response: Response) {
    try {
      const { uid } = request.params;

      const deleteCategory = new DeleteCategory(new CategoryRepository());

      const result = await deleteCategory.execute(uid);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'deleteCategory -> CategoryController', error);
    }
  }
}
