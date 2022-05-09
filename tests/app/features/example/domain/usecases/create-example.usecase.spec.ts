import { ApplicationErrorBuilder } from '@builders/shared';
import { CreateExampleCommand } from '@example/domain/commands';
import { CreateExample, CreateExampleImp } from '@example/domain/usecases';
import { CreateExampleRepository } from '@example/domain/contracts/repositories';
import { Example } from '@example/domain/models';
import { Result } from '@shared/utils';
import { CreateExampleCommandBuilder, ExampleBuilder, ExampleDTOBuilder } from '@builders/example';
import { ExampleDTO } from '@example/domain/dtos';

const makeCommand = (example?: ExampleDTO): CreateExampleCommand => {
  return example === undefined
    ? CreateExampleCommandBuilder.init().builder()
    : CreateExampleCommandBuilder.init().withExample(example).builder();
};

const makeRepository = (): CreateExampleRepository => {
  class CreateExampleRepositoryMock implements CreateExampleRepository {
    async createExample(): Promise<Example> {
      return ExampleBuilder.init().builder();
    }
  }
  return new CreateExampleRepositoryMock();
};

interface SutTypes {
  sut: CreateExample;
  repository: CreateExampleRepository;
}
const makeSut = (): SutTypes => {
  const repository = makeRepository();
  const sut = new CreateExampleImp(repository);
  return { sut, repository };
};

describe('CreateExample UseCase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if command is invalid', async () => {
    const { sut } = makeSut();

    const command = makeCommand();
    command.example.name = undefined as any;

    const result = await sut.execute(command);

    expect(result).toEqual(
      Result.error(
        400,
        ApplicationErrorBuilder.init()
          .withProcess('execute -> CreateExampleImp')
          .withMessage('Requisição inválida')
          .withDetails([
            { description: 'Este campo é obrigatório', name: 'name' },
            { description: 'Nome muito curto', name: 'name' },
          ])
          .builder(),
      ),
    );
  });

  it('should call CreateExampleRepository with correct value', async () => {
    const { sut, repository } = makeSut();
    const createExample = jest.spyOn(repository, 'createExample');

    const command = makeCommand();
    await sut.execute(command);

    expect(createExample).toHaveBeenCalledWith(command.example);
  });

  it('should call CreateExampleRepository with correct value - full', async () => {
    const { sut, repository } = makeSut();
    const createExample = jest.spyOn(repository, 'createExample');

    const command = makeCommand(
      ExampleDTOBuilder.init().withDescription('any_description').builder(),
    );

    await sut.execute(command);

    expect(createExample).toHaveBeenCalledWith(command.example);
  });

  it('should return a result with a valid example', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(makeCommand());

    expect(result.success).toBeTruthy();
    expect(result.data?.uid).toBeTruthy();
    expect(result.data?.name).toBe('any_name');
    expect(result.data?.description).toBeFalsy();
  });
});
