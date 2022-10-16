import { Result } from '@shared/utils';
import { DeleteCategory } from '@categories/usecases';
import { CategoryRepository } from '@categories/repositories';
import { CategoryBuilder } from '@builders/models';

interface SutTypes {
  sut: DeleteCategory;
  repository: CategoryRepository;
}

const makeSut = (): SutTypes => {
  const repository = new CategoryRepository();
  const sut = new DeleteCategory(repository);
  return { sut, repository };
};

describe('DeleteCategory usecase', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call CategoryRepository.deleteCategory', async () => {
    const { sut } = makeSut();

    const categoryObserver = jest
      .spyOn(CategoryRepository.prototype, 'deleteCategory')
      .mockResolvedValue(CategoryBuilder.init().builder());

    await sut.execute('any_uid');

    expect(categoryObserver).toHaveBeenCalledWith('any_uid');
  });

  it('should throw if CategoryRepository.deleteCategory throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(CategoryRepository.prototype, 'deleteCategory').mockRejectedValue(new Error('any'));

    const promise = sut.execute('any');

    await expect(promise).rejects.toThrow(new Error('any'));
  });

  it('should return a success result', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(CategoryRepository.prototype, 'deleteCategory')
      .mockResolvedValue(CategoryBuilder.init().builder());

    const result = await sut.execute('any_uid');

    expect(result).toEqual(Result.success(CategoryBuilder.init().builder().toJson()));
  });
});
