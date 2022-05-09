import { Command } from '@shared/domain/commands';
import { ApplicationError, Result } from '@shared/utils';
import { CreateExampleCommand } from '../commands';
import { CreateExampleRepository } from '../contracts/repositories';
import { Example } from '../models';

export interface CreateExample {
  execute(command: Command): Promise<Result<Example>>;
}

export class CreateExampleImp implements CreateExample {
  readonly #repository: CreateExampleRepository;

  constructor(repository: CreateExampleRepository) {
    this.#repository = repository;
  }

  async execute(command: CreateExampleCommand): Promise<Result<any>> {
    command.validate();

    if (!command.isValid) {
      return Result.error(
        400,
        new ApplicationError(
          'execute -> CreateExampleImp',
          'Requisição inválida',
          command.notifications.map((n) => ({ description: n.message, name: n.property })),
        ),
      );
    }

    const example = await this.#repository.createExample(command.example);

    return Result.success(example);
  }
}
