import { ProductDTO } from '@products/domain/dtos';

export class ProductDtoBuilder {
  #name = 'any_name';
  #type = 'any_type';
  #uidServiceProvider = 'any_uid_sp';
  #description?: string;
  #price?: number;

  static init(): ProductDtoBuilder {
    return new ProductDtoBuilder();
  }

  withPrice(price?: number): ProductDtoBuilder {
    this.#price = price ?? 1000;
    return this;
  }

  withDescription(description?: string): ProductDtoBuilder {
    this.#description = description ?? 'any_description';
    return this;
  }

  withServiceProvider(uid: string): ProductDtoBuilder {
    this.#uidServiceProvider = uid;
    return this;
  }

  invalidRequired(): ProductDtoBuilder {
    this.#name = undefined as any;
    this.#type = undefined as any;
    this.#uidServiceProvider = undefined as any;
    return this;
  }

  builder(): ProductDTO {
    return {
      name: this.#name,
      description: this.#description,
      uidServiceProvider: this.#uidServiceProvider,
      type: this.#type,
      price: this.#price,
    };
  }
}
