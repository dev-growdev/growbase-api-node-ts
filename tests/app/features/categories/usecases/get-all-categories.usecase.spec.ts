import { Result } from '@shared/utils';
import { GetAllCategories } from '@categories/usecases';
import { CategoryRepository } from '@categories/repositories';
import { CategoryBuilder } from '@builders/models';

interface SutTypes {
  sut: GetAllCategories;
  repository: CategoryRepository;
}

const makeSut = (): SutTypes => {
  const repository = new CategoryRepository();
  const sut = new GetAllCategories(repository);
  return { sut, repository };
};

describe('GetAllCategories usecase', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call CategoryRepository.getAllCategories', async () => {
    const { sut } = makeSut();

    const getAllCategoriesObserver = jest
      .spyOn(CategoryRepository.prototype, 'getAllCategories')
      .mockResolvedValue([CategoryBuilder.init().builder()]);

    await sut.execute();

    expect(getAllCategoriesObserver).toHaveBeenCalled();
  });

  it('should throw if CategoryRepository.getAllCategories throws', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(CategoryRepository.prototype, 'getAllCategories')
      .mockRejectedValue(new Error('any'));

    const promise = sut.execute();

    await expect(promise).rejects.toThrow(new Error('any'));
  });

  it('should return a success result', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(CategoryRepository.prototype, 'getAllCategories')
      .mockResolvedValue([CategoryBuilder.init().builder()]);

    const result = await sut.execute();

    expect(result).toEqual(Result.success([CategoryBuilder.init().builder().toJson()]));
  });
});
