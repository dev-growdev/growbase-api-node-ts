import bcrypt from 'bcrypt';

export class BcryptAdapter {
  readonly #salt: number;

  constructor(salt: number) {
    this.#salt = salt;
  }

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.#salt);
  }

  async compare(plainText: string, hashToCompare: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashToCompare);
  }
}
