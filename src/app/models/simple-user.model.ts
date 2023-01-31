export interface SimpleUserDTO {
  userUid: string;
  name: string;
}

export class SimpleUser {
  #userUid: string;
  get userUid(): string {
    return this.#userUid;
  }

  #name: string;
  get name(): string {
    return this.#name;
  }

  constructor({ userUid, name }: SimpleUserDTO) {
    this.#userUid = userUid;
    this.#name = name;
  }

  toJson(): SimpleUserDTO {
    return {
      userUid: this.#userUid,
      name: this.#name,
    };
  }
}
