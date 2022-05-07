import { Product, ServiceProvider } from '@products/domain/models';
import { ServiceProviderBuilder } from '..';

export class ProductBuilder {
  #uid = 'any_uid';
  #name = 'any_name';
  #type = 'any_type';
  #serviceProvider = ServiceProviderBuilder.init().builder();
  #description?: string;
  #price?: number;

  static init(): ProductBuilder {
    return new ProductBuilder();
  }

  withServiceProvider(serviceProvider: ServiceProvider): ProductBuilder {
    this.#serviceProvider = serviceProvider;
    return this;
  }

  builder(): Product {
    return {
      uid: this.#uid,
      name: this.#name,
      description: this.#description,
      type: this.#type,
      price: this.#price,
      serviceProvider: this.#serviceProvider,
    };
  }
}
