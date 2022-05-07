import { ServiceProvider } from '@products/domain/models';

export class ServiceProviderBuilder {
  #uid = 'any_uid';

  static init(): ServiceProviderBuilder {
    return new ServiceProviderBuilder();
  }

  builder(): ServiceProvider {
    return {
      uid: this.#uid,
    };
  }
}
