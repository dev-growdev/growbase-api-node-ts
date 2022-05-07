import { ServiceProvider } from '@authentication/domain/models';

export class ServiceProviderBuilder {
  #uid = 'any_uid';
  #uidProfile = 'any_uid';
  #name = 'any_name';

  static init(): ServiceProviderBuilder {
    return new ServiceProviderBuilder();
  }

  builder(): ServiceProvider {
    return {
      uid: this.#uid,
      uidProfile: this.#uidProfile,
      name: this.#name,
    };
  }
}
