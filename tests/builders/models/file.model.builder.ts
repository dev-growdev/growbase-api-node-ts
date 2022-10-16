import { File } from '@models/.';

export class FileBuilder {
  #uid = 'any_uid';
  #url = 'any_url';

  static init(): FileBuilder {
    return new FileBuilder();
  }

  builder(): File {
    return new File({
      uid: this.#uid,
      url: this.#url,
    });
  }
}
