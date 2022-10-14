import { CredentialUser } from '.';
import '@shared/utils/extension-methods';

export interface UserDTO {
  userUid: string;
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

  constructor({ profileUid, userUid, name, document, email }: UserDTO) {
    this.#profileUid = profileUid;
    this.#userUid = userUid;
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
      profileUid: this.#profileUid,
      name: this.#name,
      email: this.#email,
      document: this.#document,
    };
  }
}
