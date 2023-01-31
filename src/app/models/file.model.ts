export interface FileDTO {
  uid: string;
  url: string;
}

export class File {
  #uid: string;
  get uid(): string {
    return this.#uid;
  }

  #url: string;
  get url(): string {
    return this.#url;
  }

  constructor({ uid, url }: FileDTO) {
    this.#uid = uid;
    this.#url = url;
  }

  toJson(): FileDTO {
    return {
      uid: this.#uid,
      url: this.#url,
    };
  }
}
