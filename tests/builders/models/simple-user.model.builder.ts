import { SimpleUser } from '@models/.';

export class SimpleUserBuilder {
  #userUid = 'any_uid';
  #name = 'any_name';

  static init(): SimpleUserBuilder {
    return new SimpleUserBuilder();
  }

  builder(): SimpleUser {
    return new SimpleUser({
      userUid: this.#userUid,
      name: this.#name,
    });
  }
}
