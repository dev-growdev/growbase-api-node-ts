import jwt from 'jsonwebtoken';

export class JwtAdapter {
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
