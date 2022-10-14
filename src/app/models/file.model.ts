export interface FileJson {
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

  constructor({ uid, url }: FileJson) {
    this.#uid = uid;
    this.#url = url;
  }

  toJson(): FileJson {
    return {
      uid: this.#uid,
      url: this.#url,
    };
  }
}
