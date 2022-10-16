import { ApplicationErrorBuilder } from '@builders/shared';
import { Result } from '@shared/utils';
import { Category, FileDTO } from '@models/.';
import { CreateCategory } from '@categories/usecases';
import { CategoryRepository } from '@categories/repositories';
import { CategoryBuilder } from '@builders/models';
import { AwsService } from '@shared/external';

jest.mock('@categories/repositories/category.repository.ts', () => {
  return {
    createCategory: (): Promise<Category> => {
      return Promise.resolve(CategoryBuilder.init().builder());
    },
  };
});

jest.mock('@shared/external/aws.service.ts', () => {
  return {
    upload: (): Promise<string> => {
      return Promise.resolve('any_key');
    },
  };
});

interface CreateCategoryDTO {
  name: string;
  description?: string;
  image: FileDTO;
}

const makeData = (): CreateCategoryDTO => {
  return {
    name: 'any_name',
    description: 'any_description',
    image: {
      uid: '',
      url: 'any_url',
    },
  };
};

interface SutTypes {
  sut: CreateCategory;
  repository: CategoryRepository;
}

const makeSut = (): SutTypes => {
  const repository = new CategoryRepository();
  const sut = new CreateCategory(repository, new AwsService());
  return { sut, repository };
};

describe('CreateCategory UseCase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call CategoryRepository.createCategory with correct value', async () => {
    const { sut, repository } = makeSut();
    const observer = jest.spyOn(repository, 'createCategory');

    await sut.execute(makeData());

    const expectValue = Object.assign({}, makeData(), { image: { url: 'any_key' } });
    expect(observer).toHaveBeenCalledWith(expectValue);
  });

  // it('should call CreateExampleRepository with correct value - full', async () => {
  //   const { sut, repository } = makeSut();
  //   const createExample = jest.spyOn(repository, 'createExample');

  //   const command = makeCommand(
  //     ExampleDTOBuilder.init().withDescription('any_description').builder(),
  //   );

  //   await sut.execute(command);

  //   expect(createExample).toHaveBeenCalledWith(command.example);
  // });

  // it('should return a result with a valid example', async () => {
  //   const { sut } = makeSut();

  //   const result = await sut.execute(makeCommand());

  //   expect(result.success).toBeTruthy();
  //   expect(result.data?.uid).toBeTruthy();
  //   expect(result.data?.name).toBe('any_name');
  //   expect(result.data?.description).toBeFalsy();
  // });
});
