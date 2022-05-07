import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { ProfileDataEntity } from '@shared/infra/data/database/entities';
import { ETypeProfile } from '@shared/domain/enums';

export class ProfileDataEntityBuilder {
  #name = 'any_name';
  #email = 'any@email.com.br';
  #document = '56520319058';
  #typeProfile = ETypeProfile.PF;
  #phone?: string;
  #uidFile?: string;
  #uidAddress?: string;

  static init(): ProfileDataEntityBuilder {
    return new ProfileDataEntityBuilder();
  }

  pj(): ProfileDataEntityBuilder {
    this.#name = 'any_name';
    this.#email = 'any@email.com.br';
    this.#document = '11131645000180';
    this.#typeProfile = ETypeProfile.PJ;
    return this;
  }

  async builder(): Promise<ProfileDataEntity> {
    const repository = await pgHelper.getRepository(ProfileDataEntity);

    const dataProfile = repository.create({
      name: this.#name,
      email: this.#email,
      document: this.#document,
      typeProfile: this.#typeProfile,
      phone: this.#phone,
      uidFile: this.#uidFile,
      uidAddress: this.#uidAddress,
    });

    await repository.save(dataProfile);

    return dataProfile;
  }
}
