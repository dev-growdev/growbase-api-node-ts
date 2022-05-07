import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ServiceProviderEntity } from '@shared/infra/data/database/entities';

export class ServiceProviderEntityBuilder {
  #uidProfile!: string;
  #companyType!: string;

  static init(uidProfile: string): ServiceProviderEntityBuilder {
    const builder = new ServiceProviderEntityBuilder();
    builder.#uidProfile = uidProfile;
    return builder;
  }

  withCompanyType(companyType: string): ServiceProviderEntityBuilder {
    this.#companyType = companyType;
    return this;
  }

  async builder(): Promise<ServiceProviderEntity> {
    const repository = await pgHelper.getRepository(ServiceProviderEntity);

    const serviceProvider = repository.create({
      uidProfile: this.#uidProfile,
      companyType: this.#companyType,
    });

    await repository.save(serviceProvider);

    return serviceProvider;
  }
}
