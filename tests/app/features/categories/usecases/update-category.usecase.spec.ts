import { Result } from '@shared/utils';
import { FileDTO } from '@models/.';
import { UpdateCategory } from '@categories/usecases';
import { CategoryRepository } from '@categories/repositories';
import { CategoryBuilder } from '@builders/models';
import { AwsService } from '@shared/external';

interface UpdateCategoryDTO {
  uid: string;
  name: string;
  description?: string;
  image: FileDTO;
}

const makeData = (updateImage = false): UpdateCategoryDTO => {
  return {
    uid: 'any_uid',
    name: 'any_name',
    description: 'any_description',
    image: {
      uid: updateImage ? '' : 'any_uid',
      url: 'any_url',
    },
  };
};

interface SutTypes {
  sut: UpdateCategory;
  repository: CategoryRepository;
}

const makeSut = (): SutTypes => {
  const repository = new CategoryRepository();
  const sut = new UpdateCategory(repository, new AwsService());
  return { sut, repository };
};

describe('UpdateCategory usecase', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call CategoryRepository.updateCategory and not call AwsService.upload', async () => {
    const { sut } = makeSut();

    const uploadObserver = jest.spyOn(AwsService.prototype, 'upload');

    const categoryObserver = jest
      .spyOn(CategoryRepository.prototype, 'updateCategory')
      .mockResolvedValue(CategoryBuilder.init().builder());

    await sut.execute(makeData());

    expect(uploadObserver).not.toHaveBeenCalled();
    expect(categoryObserver).toHaveBeenCalledWith(makeData());
  });

  it('should call CategoryRepository.updateCategory and AwsService.upload', async () => {
    const { sut } = makeSut();

    const uploadObserver = jest.spyOn(AwsService.prototype, 'upload').mockResolvedValue('any_key');
    const categoryObserver = jest
      .spyOn(CategoryRepository.prototype, 'updateCategory')
      .mockResolvedValue(CategoryBuilder.init().builder());

    await sut.execute(makeData(true));

    const expectValue = Object.assign({}, makeData(true), { image: { url: 'any_key', uid: '' } });

    expect(uploadObserver).toHaveBeenCalledWith('any_url');
    expect(categoryObserver).toHaveBeenCalledWith(expectValue);
  });

  it('should throw if CategoryRepository.updateCategory throws', async () => {
    const { sut } = makeSut();

    const uploadObserver = jest.spyOn(AwsService.prototype, 'upload').mockResolvedValue('any');
    jest.spyOn(CategoryRepository.prototype, 'updateCategory').mockRejectedValue(new Error('any'));

    const promise = sut.execute(makeData());

    expect(uploadObserver).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new Error('any'));
  });

  it('should throw if AwsService.upload throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(AwsService.prototype, 'upload').mockRejectedValue(new Error('any'));
    const categoryObserver = jest.spyOn(CategoryRepository.prototype, 'updateCategory');

    const promise = sut.execute(makeData(true));

    expect(categoryObserver).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new Error('any'));
  });

  it('should return a success result', async () => {
    const { sut } = makeSut();

    const uploadObserver = jest.spyOn(AwsService.prototype, 'upload');
    jest
      .spyOn(CategoryRepository.prototype, 'updateCategory')
      .mockResolvedValue(CategoryBuilder.init().builder());

    const result = await sut.execute(makeData());

    expect(uploadObserver).not.toHaveBeenCalled();
    expect(result).toEqual(Result.success(CategoryBuilder.init().builder().toJson()));
  });
});
