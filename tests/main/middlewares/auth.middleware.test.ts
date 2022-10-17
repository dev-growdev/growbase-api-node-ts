import request from 'supertest';
import app from '@main/config/app';
import { appEnvironments } from '@envs/.';
import { AuthMiddleware } from '@shared/middlewares';
import { JwtAdapter } from '@shared/adapters';

describe('Auth Middleware', () => {
  it('should return forbiden when token does not provided', async () => {
    app.get('/auth_test_not_token', new AuthMiddleware().handle, (req: any, res) =>
      res.status(200).json(req.authenticatedUser),
    );
    await request(app)
      .get('/auth_test_not_token')
      .send()
      .expect(401, {
        success: false,
        code: 401,
        error: {
          process: 'handle -> AuthMiddleware',
          message: 'Acesso negado',
          details: [],
        },
      });
  });

  it('should return forbiden when token is invalid format', async () => {
    app.get('/auth_test_token_invalid_format', new AuthMiddleware().handle, (req: any, res) =>
      res.status(200).json(req.authenticatedUser),
    );
    await request(app)
      .get('/auth_test_token_invalid_format')
      .set('Authorization', 'any_token')
      .send()
      .expect(401, {
        success: false,
        code: 401,
        error: {
          process: 'handle -> AuthMiddleware',
          message: 'Acesso negado',
          details: [],
        },
      });
  });

  it('should return forbiden when decrypter returns error', async () => {
    app.get('/auth_test_decrypter_error', new AuthMiddleware().handle, (req: any, res) =>
      res.status(200).json(req.authenticatedUser),
    );

    const jwt = new JwtAdapter(appEnvironments.JWT_SECRET, '1ms');
    const token = await jwt.encrypt({ name: 'teste' });

    await request(app)
      .get('/auth_test_decrypter_error')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(401, {
        success: false,
        code: 401,
        error: {
          process: 'handle -> AuthMiddleware',
          message: 'Acesso negado',
          details: [],
        },
      });
  });

  it('should return status 200 when token succeeds', async () => {
    app.get('/auth_test_succeed', new AuthMiddleware().handle, (req: any, res) =>
      res.status(200).json(req.authUser),
    );

    const jwt = new JwtAdapter(appEnvironments.JWT_SECRET, '5d');
    const token = await jwt.encrypt({ name: 'teste' });

    await request(app)
      .get('/auth_test_succeed')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200)
      .expect((req) => {
        expect(req.body.name).toBe('teste');
      });
  });
});
