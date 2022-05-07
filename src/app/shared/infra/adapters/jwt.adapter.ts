import jwt from 'jsonwebtoken';
import { DecrypterAdapter, EncrypterAdapter } from '@shared/adapters';

export class JwtAdapter implements EncrypterAdapter, DecrypterAdapter {
  readonly #secret: string;
  readonly #expireIn: string;

  constructor(secret: string, expireIn: string) {
    this.#secret = secret;
    this.#expireIn = expireIn;
  }

  async encrypt(data: any): Promise<string> {
    return jwt.sign(data, this.#secret, { expiresIn: this.#expireIn });
  }

  async decrypt(cipherText: string): Promise<any> {
    return jwt.verify(cipherText, this.#secret) as any;
  }
}
