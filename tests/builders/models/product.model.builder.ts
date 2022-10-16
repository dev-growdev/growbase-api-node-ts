import { Category, Product, SimpleUser } from '@models/.';
import { FileBuilder } from '.';

export class ProductBuilder {
  #uid = 'any_uid';
  #name = 'any_name';
  #description = 'any@email.com';
  #enable = true;
  #coverImage = FileBuilder.init().builder();
  #images = [FileBuilder.init().builder()];
  #categories?: Category[];
  #createdUser?: SimpleUser;

  static init(): ProductBuilder {
    return new ProductBuilder();
  }

  builder(): Product {
    return new Product({
      uid: this.#uid,
      name: this.#name,
      description: this.#description,
      enable: this.#enable,
      coverImage: this.#coverImage,
      images: this.#images,
      categories: this.#categories,
      createdUser: this.#createdUser,
    });
  }
}
