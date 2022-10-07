import { AuthenticatedUser } from '@shared/dtos';

export class AuthenticatedUserBuilder {
  #uidProfile = 'any_uid_profile';
  #uidUser = 'any_uid_user';

  static init(): AuthenticatedUserBuilder {
    return new AuthenticatedUserBuilder();
  }

  builder(): AuthenticatedUser {
    return {
      uidProfile: this.#uidProfile,
      uidUser: this.#uidUser,
    };
  }
}
