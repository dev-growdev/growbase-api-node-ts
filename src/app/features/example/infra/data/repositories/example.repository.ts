import { CreateExampleRepository } from '@example/domain/contracts/repositories';
import { ExampleDTO } from '@example/domain/dtos';
import { Example } from '@example/domain/models';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ExampleEntity } from '@shared/infra/data/database/entities';

export class ExampleRepository implements CreateExampleRepository {
  async createExample(exampleDto: ExampleDTO): Promise<Example> {
    const repository = await pgHelper.getRepository(ExampleEntity);

    const example = repository.create({
      name: exampleDto.name,
      description: exampleDto.description,
    });

    await repository.save(example);

    return {
      uid: example.uid,
      name: example.name,
      description: example.description,
    };
  }
}
