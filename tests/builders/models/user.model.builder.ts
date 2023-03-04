import { CredentialUser, User } from '@models/.';

export class UserBuilder {
  #userUid = 'any_uid';
  #profileUid = 'any_uid';
  #name = 'any_name';
  #email = 'any@email.com';
  #document = '56520319058';
  #credential?: CredentialUser;
  #userRoleUid = 'any_uid';

  static init(): UserBuilder {
    return new UserBuilder();
  }

  withCredential(credential: CredentialUser): UserBuilder {
    this.#credential = credential;
    return this;
  }

  builder(): User {
    const user = new User({
      userUid: this.#userUid,
      profileUid: this.#profileUid,
      userRoleUid: this.#userRoleUid,
      name: this.#name,
      email: this.#email,
      document: this.#document,
    });

    if (this.#credential) {
      user.addCredential(this.#credential);
    }
    return user;
  }
}
