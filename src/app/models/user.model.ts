import { CredentialUser } from '.';
import '@shared/utils/extension-methods';

export interface UserDTO {
  userUid: string;
  userRoleUid: string;
  profileUid: string;
  name: string;
  email: string;
  document?: string;
}

export class User {
  #userUid: string;
  get userUid(): string {
    return this.#userUid;
  }

  #userRoleUid: string;
  get userRoleUid(): string {
    return this.#userRoleUid;
  }

  #profileUid: string;
  get profileUid(): string {
    return this.#profileUid;
  }

  #name: string;
  get name(): string {
    return this.#name;
  }

  #email: string;
  get email(): string {
    return this.#email;
  }

  #document?: string;
  get document(): string | undefined {
    return this.#document;
  }

  #credential?: CredentialUser;
  get credential(): CredentialUser | undefined {
    return this.#credential;
  }

  constructor({ profileUid, userUid, userRoleUid, name, document, email }: UserDTO) {
    this.#profileUid = profileUid;
    this.#userUid = userUid;
    this.#userRoleUid = userRoleUid;
    this.#name = name;
    this.#document = document?.removeSpecialCharacters();
    this.#email = email;
  }

  addCredential(credential: CredentialUser): void {
    this.#credential = credential;
  }

  clearCredential(): void {
    this.#credential = undefined;
  }

  toJson(): UserDTO {
    return {
      userUid: this.#userUid,
      userRoleUid: this.#userRoleUid,
      profileUid: this.#profileUid,
      name: this.#name,
      email: this.#email,
      document: this.#document,
    };
  }
}
