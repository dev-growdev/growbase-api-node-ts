import { pgHelper } from '@shared/database/connections/pg-helper';
import { ProductCategoryEntity } from '@shared/database/entities';

export class ProductCategoryEntityBuilder {
  #categoryUid!: string;
  #productUid!: string;

  static init(categoryUid: string, productUid: string): ProductCategoryEntityBuilder {
    const builder = new ProductCategoryEntityBuilder();
    builder.#categoryUid = categoryUid;
    builder.#productUid = productUid;
    return builder;
  }

  async builder(): Promise<ProductCategoryEntity> {
    const manager = pgHelper.client.manager;

    const user = manager.create(ProductCategoryEntity, {
      categoryUid: this.#categoryUid,
      productUid: this.#productUid,
    });

    await manager.save(user);

    return user;
  }
}
