import bcrypt from 'bcrypt';
import { HasherAdapter, HashCompareAdapter } from '@shared/adapters';

export class BcryptAdapter implements HasherAdapter, HashCompareAdapter {
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
