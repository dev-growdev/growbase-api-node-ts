import { DecrypterAdapter } from '@shared/adapters';
import { Result } from '@shared/utils';
import { HttpRequest, HttpResponse, Middleware } from '../contracts';
import { forbidden, ok } from '../helpers';

export class AuthMiddleware implements Middleware {
  #decrypter: DecrypterAdapter;

  constructor(decrypter: DecrypterAdapter) {
    this.#decrypter = decrypter;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const authorization: string = request.headers['authorization'];
    if (!authorization) return forbidden();

    const [, token] = authorization.split(' ');
    if (!token) return forbidden();

    try {
      const data = await this.#decrypter.decrypt(token);

      return ok(Result.success({ authenticatedUser: { ...data } }));
    } catch (error) {
      return forbidden();
    }
  }
}
