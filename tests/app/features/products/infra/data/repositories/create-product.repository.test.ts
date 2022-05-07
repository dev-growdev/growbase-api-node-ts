import {
  ProductEntity,
  ProfileDataEntity,
  ServiceProviderEntity,
} from '@shared/infra/data/database/entities';
import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ProductDTO } from '@products/domain/dtos';
import { ProductRepository } from '@products/infra/data/repositories';
import { CreateProductRepository } from '@products/domain/contracts/repositories';
import { ProfileDataEntityBuilder, ServiceProviderEntityBuilder } from '@builders/shared';
import { ProductDtoBuilder } from '@builders/products';

const makeServiceProviderDB = async (): Promise<ServiceProviderEntity> => {
  const profile = await ProfileDataEntityBuilder.init().pj().builder();
  const serviceProvider = await ServiceProviderEntityBuilder.init(profile.uid).builder();
  return serviceProvider;
};

const makeProduct = async (uidServiceProvider: string): Promise<ProductDTO> => {
  return ProductDtoBuilder.init().withServiceProvider(uidServiceProvider).builder();
};

const makeSut = (): CreateProductRepository => {
  return new ProductRepository();
};

const clearEntities = async (): Promise<void> => {
  await pgHelper.client.manager.clear(ProductEntity);
  await pgHelper.client.manager.clear(ServiceProviderEntity);
  await pgHelper.client.manager.clear(ProfileDataEntity);
};

describe('CreateProduct Repository', () => {
  let serviceProvider: ServiceProviderEntity;

  beforeAll(async () => {
    await pgHelper.connect();
    serviceProvider = await makeServiceProviderDB();
  });

  afterAll(async () => {
    await clearEntities();
    await pgHelper.disconnect();
  });

  it('should create product without price and description', async () => {
    const sut = makeSut();
    const params = await makeProduct(serviceProvider.uid);

    const result = await sut.createProduct(params);

    expect(result).toBeTruthy();
    expect(result.name).toBe('any_name');
    expect(result.serviceProvider.uid).toBe(serviceProvider.uid);
    expect(result.type).toBe('any_type');
    expect(result.description).toBeFalsy();
    expect(result.price).toBeFalsy();
  });

  it('should create a full product', async () => {
    const sut = makeSut();
    const params = await makeProduct(serviceProvider.uid);
    params.price = 1000;
    params.description = 'any_description';

    const result = await sut.createProduct(params);

    expect(result).toBeTruthy();
    expect(result.name).toBe('any_name');
    expect(result.serviceProvider.uid).toBe(serviceProvider.uid);
    expect(result.type).toBe('any_type');
    expect(result.description).toBe('any_description');
    expect(result.price).toBe(1000);
  });
});
