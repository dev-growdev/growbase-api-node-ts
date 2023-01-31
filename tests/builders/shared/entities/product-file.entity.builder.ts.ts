import { pgHelper } from '@shared/database/connections/pg-helper';
import { ProductFileEntity } from '@shared/database/entities';

export class ProductFileEntityBuilder {
  #fileUid!: string;
  #productUid!: string;

  static init(fileUid: string, productUid: string): ProductFileEntityBuilder {
    const builder = new ProductFileEntityBuilder();
    builder.#fileUid = fileUid;
    builder.#productUid = productUid;
    return builder;
  }

  async builder(): Promise<ProductFileEntity> {
    const manager = pgHelper.client.manager;

    const user = manager.create(ProductFileEntity, {
      fileUid: this.#fileUid,
      productUid: this.#productUid,
    });

    await manager.save(user);

    return user;
  }
}
