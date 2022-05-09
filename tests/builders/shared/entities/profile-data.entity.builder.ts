import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ProfileDataEntity } from '@shared/infra/data/database/entities';

export class ProfileDataEntityBuilder {
  #name = 'any_name';
  #email = 'any@email.com.br';
  #document = '56520319058';
  #phone?: string;
  #uidFile?: string;

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
    const repository = await pgHelper.getRepository(ProfileDataEntity);

    const dataProfile = repository.create({
      name: this.#name,
      email: this.#email,
      document: this.#document,
      phone: this.#phone,
      uidFile: this.#uidFile,
    });

    await repository.save(dataProfile);

    return dataProfile;
  }
}
