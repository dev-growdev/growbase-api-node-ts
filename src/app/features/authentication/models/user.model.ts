import { CpfCnpjDTO, CredentialUserDTO } from '@authentication/dtos';

interface UserDTO {
  userUid: string;
  profileUid: string;
  name: string;
  email: string;
  document?: CpfCnpjDTO;
  credential?: CredentialUserDTO;
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

  #document?: CpfCnpjDTO;
  get document(): CpfCnpjDTO | undefined {
    return this.#document;
  }

  #credential?: CredentialUserDTO;
  get credential(): CredentialUserDTO | undefined {
    return this.#credential;
  }

  constructor({ profileUid, userUid, name, document, email, credential }: UserDTO) {
    this.#profileUid = profileUid;
    this.#userUid = userUid;
    this.#name = name;
    this.#document = document;
    this.#email = email;
    this.#credential = credential;
  }

  clearCredential(): void {
    this.#credential = undefined;
  }

  toJson(): any {
    return {
      userUid: this.#userUid,
      profileUid: this.#profileUid,
      name: this.#name,
      email: this.#email,
      document: this.#document?.value,
    };
  }
}
