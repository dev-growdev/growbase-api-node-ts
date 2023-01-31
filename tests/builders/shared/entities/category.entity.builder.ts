import { pgHelper } from '@shared/database/connections/pg-helper';
import { CategoryEntity } from '@shared/database/entities';

export class CategoryEntityBuilder {
  #name = 'any_name';
  #description?: string;
  #enable = true;
  #fileUid!: string;

  static init(fileUid: string): CategoryEntityBuilder {
    const builder = new CategoryEntityBuilder();
    builder.#fileUid = fileUid;
    return builder;
  }

  withDescription(description: string): CategoryEntityBuilder {
    this.#description = description;
    return this;
  }

  async builder(): Promise<CategoryEntity> {
    const manager = pgHelper.client.manager;

    const user = manager.create(CategoryEntity, {
      name: this.#name,
      description: this.#description,
      enable: this.#enable,
      fileUid: this.#fileUid,
    });

    await manager.save(user);

    return user;
  }
}
