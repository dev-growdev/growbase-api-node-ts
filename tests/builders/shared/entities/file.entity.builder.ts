import { pgHelper } from '@shared/database/connections/pg-helper';
import { FileEntity } from '@shared/database/entities';

export class FileEntityBuilder {
  #name = 'any_name';
  #key = 'any_key';

  static init(): FileEntityBuilder {
    return new FileEntityBuilder();
  }

  async builder(): Promise<FileEntity> {
    const manager = pgHelper.client.manager;

    const user = manager.create(FileEntity, {
      name: this.#name,
      key: this.#key,
    });

    await manager.save(user);

    return user;
  }
}
