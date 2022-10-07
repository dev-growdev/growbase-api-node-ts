import { AuthUser, User } from '@authentication/models';

type AuthUserPartial = Partial<AuthUser>;

export class UserBuilder {
  #uid = 'any_uid';
  #uidProfile = 'any_uid';
  #name = 'any_name';
  #email = 'any@email.com';
  #document = '56520319058';
  #auth?: AuthUser;

  static init(): UserBuilder {
    return new UserBuilder();
  }

  withAuth(auth?: AuthUserPartial): UserBuilder {
    this.#auth = {
      login: (auth?.login as any) ?? this.#email,
      password: auth?.password ?? 'any_password',
      enable: (auth?.enable as any) ?? true,
      verified: (auth?.verified as any) ?? true,
    };
    return this;
  }

  builder(): User {
    return {
      uid: this.#uid,
      uidProfile: this.#uidProfile,
      name: this.#name,
      email: this.#email,
      document: this.#document,
      auth: this.#auth,
    };
  }
}
