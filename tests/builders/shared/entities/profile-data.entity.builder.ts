import { pgHelper } from '@shared/database/connections/pg-helper';
import { ProfileDataEntity } from '@shared/database/entities';

export class ProfileDataEntityBuilder {
  #name = 'any_name';
  #email = 'any@email.com.br';
  #document = '56520319058';
  #phone?: string;
  #fileUid?: string;

  static init(): ProfileDataEntityBuilder {
    return new ProfileDataEntityBuilder();
  }

  pj(): ProfileDataEntityBuilder {
    this.#name = 'any_name';
    this.#email = 'any@email.com.br';
    this.#document = '11131645000180';
    return this;
  }

  async builder(): Promise<ProfileDataEntity> {
    const manager = pgHelper.client.manager;

    const dataProfile = manager.create(ProfileDataEntity, {
      name: this.#name,
      email: this.#email,
      document: this.#document,
      phone: this.#phone,
      fileUid: this.#fileUid,
    });

    await manager.save(dataProfile);

    return dataProfile;
  }
}
