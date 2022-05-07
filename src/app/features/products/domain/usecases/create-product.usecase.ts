import { Command } from '@shared/domain/commands';
import { ApplicationError, Result } from '@shared/utils';
import { CreateProductCommand } from '../commands';
import { CreateProductRepository } from '../contracts/repositories';
import { Product } from '../models';

export interface CreateProduct {
  execute(command: Command): Promise<Result<Product>>;
}

export class CreateProductImp implements CreateProduct {
  readonly #repository: CreateProductRepository;

  constructor(repository: CreateProductRepository) {
    this.#repository = repository;
  }

  async execute(command: CreateProductCommand): Promise<Result<Product>> {
    command.validate();

    if (!command.isValid) {
      return Result.error(
        400,
        new ApplicationError(
          'execute -> CreateProductImp',
          'Requisição inválida',
          command.notifications.map((notification) => ({
            name: notification.property,
            description: notification.message,
          })),
        ),
      );
    }

    const product = await this.#repository.createProduct(command.product);

    return Result.success(product);
  }
}
