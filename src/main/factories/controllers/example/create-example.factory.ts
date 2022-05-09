import { CreateExampleImp } from '@example/domain/usecases';
import { ExampleRepository } from '@example/infra/data/repositories';
import { CreateExampleController } from '@example/presentation/controllers';
import { Controller } from '@shared/presentation/contracts';

export const makeCreateExampleController = (): Controller => {
  const repository = new ExampleRepository();
  const createExample = new CreateExampleImp(repository);
  return new CreateExampleController(createExample);
};
