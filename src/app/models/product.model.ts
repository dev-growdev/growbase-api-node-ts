import { Category, CategoryDTO, FileDTO, SimpleUser, SimpleUserDTO, File } from '.';

export interface ProductDTO {
  uid: string;
  name: string;
  description: string;
  enable: boolean;
  coverImage: FileDTO;
  images: FileDTO[];
  categories?: CategoryDTO[];
  createdUser?: SimpleUserDTO;
}

export class Product {
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

  #createdUser?: SimpleUser;
  get createdUser(): SimpleUser | undefined {
    return this.#createdUser;
  }

  #categories?: Category[];
  get categories(): Category[] | undefined {
    return this.#categories;
  }

  #coverImage: File;
  get coverImage(): File {
    return this.#coverImage;
  }

  #images: File[];
  get images(): File[] {
    return this.#images;
  }

  constructor({
    uid,
    name,
    description,
    enable,
    createdUser,
    categories,
    images,
    coverImage,
  }: ProductDTO) {
    this.#uid = uid;
    this.#name = name;
    this.#description = description;
    this.#enable = enable;
    this.#coverImage = new File(coverImage);
    this.#images = images.map((i) => new File(i));

    if (categories) {
      this.#categories = categories.map((c) => new Category(c));
    }

    if (createdUser) {
      this.#createdUser = new SimpleUser(createdUser);
    }
  }

  toJson(): ProductDTO {
    return {
      uid: this.#uid,
      name: this.#name,
      description: this.#description,
      enable: this.#enable,
      coverImage: this.#coverImage.toJson(),
      categories: this.#categories?.map((c) => c.toJson()),
      createdUser: this.#createdUser?.toJson(),
      images: this.#images.map((i) => i.toJson()),
    };
  }
}
