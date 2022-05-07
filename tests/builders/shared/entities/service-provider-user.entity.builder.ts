import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ServiceProviderUserEntity } from '@shared/infra/data/database/entities';

export class ServiceProviderUserEntityBuilder {
  #uidUser!: string;
  #uidServiceProvider!: string;

  static init(uidUser: string, uidServiceProvider: string): ServiceProviderUserEntityBuilder {
    const builder = new ServiceProviderUserEntityBuilder();
    builder.#uidUser = uidUser;
    builder.#uidServiceProvider = uidServiceProvider;
    return builder;
  }

  async builder(): Promise<ServiceProviderUserEntity> {
    const repository = await pgHelper.getRepository(ServiceProviderUserEntity);

    const serviceProviderUser = repository.create({
      uidUser: this.#uidUser,
      uidServiceProvider: this.#uidServiceProvider,
    });

    await repository.save(serviceProviderUser);

    return serviceProviderUser;
  }
}
