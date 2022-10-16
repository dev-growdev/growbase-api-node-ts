import { pgHelper } from '@shared/database/connections/pg-helper';
import { UserEntity } from '@shared/database/entities';

export class UserEntityBuilder {
  #password = '123456';
  #enable = true;
  #verified = true;
  #login!: string;
  #profileUid!: string;

  static init(profileUid: string, login: string): UserEntityBuilder {
    const builder = new UserEntityBuilder();
    builder.#profileUid = profileUid;
    builder.#login = login;
    return builder;
  }

  async builder(): Promise<UserEntity> {
    const manager = pgHelper.client.manager;

    const user = manager.create(UserEntity, {
      login: this.#login,
      enable: this.#enable,
      password: this.#password,
      verified: this.#verified,
      profileUid: this.#profileUid,
    });

    await manager.save(user);

    return user;
  }
}
