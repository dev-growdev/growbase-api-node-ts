import { Request, Response } from 'express';
import { notOk, ok, serverError } from '@shared/utils';
import { AwsService } from '@shared/external';
import { CreateProduct, GetAllProducts } from '@products/usecases';
import { ProductRepository } from '@products/repositories';

export class ProductController {
  async getAllProducts(request: Request, response: Response) {
    try {
      const getAllProducts = new GetAllProducts(new ProductRepository());

      const result = await getAllProducts.execute();

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'getAllProducts -> ProductController', error);
    }
  }

  async createProduct(request: Request, response: Response) {
    try {
      const { name, description, images, categories } = request.body;

      const createProduct = new CreateProduct(new ProductRepository(), new AwsService());

      const result = await createProduct.execute({
        name,
        description,
        categories,
        createdUser: { name: '', userUid: request.authUser.userUid },
        images,
      });

      if (!result.success) return notOk(response, result);

      return ok(response, result);
    } catch (error: any) {
      return serverError(response, 'createProduct -> ProductController', error);
    }
  }
}
