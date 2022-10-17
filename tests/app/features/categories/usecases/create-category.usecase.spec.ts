import { Result } from '@shared/utils';
import { FileDTO } from '@models/.';
import { CreateCategory } from '@categories/usecases';
import { CategoryRepository } from '@categories/repositories';
import { CategoryBuilder } from '@builders/models';
import { AwsService } from '@shared/external';

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

describe('CreateCategory usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call CategoryRepository.createCategory and AwsService.upload with correct value', async () => {
    const { sut } = makeSut();

    const uploadObserver = jest.spyOn(AwsService.prototype, 'upload').mockResolvedValue('any_key');
    const createCategoryObserver = jest
      .spyOn(CategoryRepository.prototype, 'createCategory')
      .mockResolvedValue(CategoryBuilder.init().builder());

    await sut.execute(makeData());

    const expectValue = Object.assign({}, makeData(), { image: { url: 'any_key', uid: '' } });

    expect(uploadObserver).toHaveBeenCalledWith('any_url');
    expect(createCategoryObserver).toHaveBeenCalledWith(expectValue);
  });

  it('should throw if AwsService.upload throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(AwsService.prototype, 'upload').mockRejectedValue(new Error('any'));
    const createCategoryObserver = jest.spyOn(CategoryRepository.prototype, 'createCategory');

    const promise = sut.execute(makeData());

    expect(createCategoryObserver).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new Error('any'));
  });

  it('should throw if CategoryRepository.createCategory throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(AwsService.prototype, 'upload').mockResolvedValue('any');
    jest.spyOn(CategoryRepository.prototype, 'createCategory').mockRejectedValue(new Error('any'));

    const promise = sut.execute(makeData());

    await expect(promise).rejects.toThrow(new Error('any'));
  });

  it('should return a success result', async () => {
    const { sut } = makeSut();

    jest.spyOn(AwsService.prototype, 'upload').mockResolvedValue('any_key');
    jest
      .spyOn(CategoryRepository.prototype, 'createCategory')
      .mockResolvedValue(CategoryBuilder.init().builder());

    const result = await sut.execute(makeData());

    expect(result).toEqual(Result.success(CategoryBuilder.init().builder().toJson()));
  });
});
