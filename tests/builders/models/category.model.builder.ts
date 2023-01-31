import { Category } from '@models/.';
import { FileBuilder } from '.';

export class CategoryBuilder {
  #uid = 'any_uid';
  #name = 'any_name';
  #description = 'any@email.com';
  #enable = true;
  #image = FileBuilder.init().builder();

  static init(): CategoryBuilder {
    return new CategoryBuilder();
  }

  builder(): Category {
    return new Category({
      uid: this.#uid,
      name: this.#name,
      description: this.#description,
      enable: this.#enable,
      image: this.#image,
    });
  }
}
