import { File, FileJson } from '.';

export interface CategoryJson {
  uid: string;
  name: string;
  description: string;
  enable: boolean;
  image: FileJson;
}

export class Category {
  #uid: string;
  get uid(): string {
    return this.#uid;
  }

  #name: string;
  get name(): string {
    return this.#name;
  }

  #description: string;
  get description(): string {
    return this.#description;
  }

  #enable: boolean;
  get enable(): boolean {
    return this.#enable;
  }

  #image: File;
  get image(): File {
    return this.#image;
  }

  constructor({ uid, name, description, enable, image }: CategoryJson) {
    this.#uid = uid;
    this.#name = name;
    this.#description = description;
    this.#enable = enable;
    this.#image = new File(image);
  }

  toJson(): CategoryJson {
    return {
      uid: this.#uid,
      name: this.#name,
      description: this.#description,
      enable: this.#enable,
      image: this.#image.toJson(),
    };
  }

  addNewImage(key: string) {
    this.#image = new File({ uid: '', url: key });
  }

  updateImage(uid: string, url: string) {
    this.#image = new File({ uid, url });
  }
}
