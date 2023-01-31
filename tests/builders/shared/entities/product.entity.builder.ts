import { pgHelper } from '@shared/database/connections/pg-helper';
import { ProductEntity } from '@shared/database/entities';

export class ProductEntityBuilder {
  #name = 'any_name';
  #description = 'any_description';
  #enable = true;
  #createdByUserUid!: string;

  static init(createdByUserUid: string): ProductEntityBuilder {
    const builder = new ProductEntityBuilder();
    builder.#createdByUserUid = createdByUserUid;
    return builder;
  }

  async builder(): Promise<ProductEntity> {
    const manager = pgHelper.client.manager;

    const user = manager.create(ProductEntity, {
      name: this.#name,
      description: this.#description,
      enable: this.#enable,
      createdByUserUid: this.#createdByUserUid,
    });

    await manager.save(user);

    return user;
  }
}
