import { Request, Response } from 'express';
import { notFound, notOk, ok, serverError } from '@shared/utils';
import { AwsService } from '@shared/external';
import {
  CreateProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductByUid,
  UpdateProduct,
} from '@products/usecases';
import { ProductRepository } from '@products/repositories';

export class ProductController {
  async getAllProducts(request: Request, response: Response) {
    try {
      const usecase = new GetAllProducts(new ProductRepository());

      const result = await usecase.execute();

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'getAllProducts -> ProductController', error);
    }
  }

  async getProductByUid(request: Request, response: Response) {
    try {
      const { uid } = request.params;

      const usecase = new GetProductByUid(new ProductRepository());

      const result = await usecase.execute(uid);

      if (!result.success) return notOk(response, result);

      if (!result.data) return notFound(response, 'Produto não encontrado');

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'getProductByUid -> ProductController', error);
    }
  }

  async createProduct(request: Request, response: Response) {
    try {
      const { name, description, images, categories } = request.body;

      const usecase = new CreateProduct(new ProductRepository(), new AwsService());

      const result = await usecase.execute({
        name,
        description,
        categories,
        createdUserUid: request.authUser.userUid,
        images,
      });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'createProduct -> ProductController', error);
    }
  }

  async updateProduct(request: Request, response: Response) {
    try {
      const { uid } = request.params;
      const { name, description, images, categories } = request.body;

      const usecase = new UpdateProduct(new ProductRepository(), new AwsService());

      const result = await usecase.execute({
        uid,
        name,
        description,
        categories,
        images,
      });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'updateProduct -> ProductController', error);
    }
  }

  async deleteProduct(request: Request, response: Response) {
    try {
      const { uid } = request.params;

      const usecase = new DeleteProduct(new ProductRepository());

      const result = await usecase.execute(uid);

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'deleteProduct -> ProductController', error);
    }
  }
}
