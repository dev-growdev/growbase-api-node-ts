import { ExampleDTOBuilder } from '@builders/example';
import { CreateExampleRepository } from '@example/domain/contracts/repositories';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ExampleRepository } from '@example/infra/data/repositories';
import { ExampleEntity } from '@shared/infra/data/database/entities';

const makeSut = (): CreateExampleRepository => {
  return new ExampleRepository();
};

describe('CreateExample Repository', () => {
  beforeAll(async () => {
    await pgHelper.connect();
  });

  afterAll(async () => {
    await pgHelper.client.manager.clear(ExampleEntity);
    await pgHelper.disconnect();
  });

  it('should create example without description', async () => {
    const sut = makeSut();
    const example = ExampleDTOBuilder.init().builder();

    const result = await sut.createExample(example);

    expect(result).toBeTruthy();
    expect(result.uid).toBeTruthy();
    expect(result.name).toBe('any_name');
    expect(result.description).toBeFalsy();
  });

  it('should create example with', async () => {
    const sut = makeSut();
    const example = ExampleDTOBuilder.init().withDescription('any').builder();

    const result = await sut.createExample(example);

    expect(result).toBeTruthy();
    expect(result.uid).toBeTruthy();
    expect(result.name).toBe('any_name');
    expect(result.description).toBe('any');
  });
});
