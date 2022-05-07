import { pgHelper } from '@shared/infra/data/connections/pg-helper';
import { UserEntity } from '@shared/infra/data/database/entities';

export class UserEntityBuilder {
  #password = '123456';
  #enable = true;
  #verified = true;
  #login!: string;
  #uidProfile!: string;

  static init(uidProfile: string, login: string): UserEntityBuilder {
    const builder = new UserEntityBuilder();
    builder.#uidProfile = uidProfile;
    builder.#login = login;
    return builder;
  }

  async builder(): Promise<UserEntity> {
    const repository = await pgHelper.getRepository(UserEntity);

    const user = repository.create({
      login: this.#login,
      enable: this.#enable,
      password: this.#password,
      verified: this.#verified,
      uidProfile: this.#uidProfile,
    });

    await repository.save(user);

    return user;
  }
}
