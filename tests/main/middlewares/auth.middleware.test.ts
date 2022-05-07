import request from 'supertest';
import app from '@main/config/app';
import { auth } from '@main/middlewares';
import { JwtAdapter } from '@shared/infra/adapters';
import { appEnvironments } from '@shared/envs';

describe('Auth Middleware', () => {
  it('should return forbiden when token does not provided', async () => {
    app.get('/auth_test_not_token', auth, (req: any, res) =>
      res.status(200).json(req.authenticatedUser),
    );
    await request(app)
      .get('/auth_test_not_token')
      .send()
      .expect(403, {
        success: false,
        code: 403,
        error: {
          process: 'handle -> AuthMiddleware',
          message: 'Acesso negado',
          details: [],
        },
      });
  });

  it('should return forbiden when token is invalid format', async () => {
    app.get('/auth_test_token_invalid_format', auth, (req: any, res) =>
      res.status(200).json(req.authenticatedUser),
    );
    await request(app)
      .get('/auth_test_token_invalid_format')
      .set('Authorization', 'any_token')
      .send()
      .expect(403, {
        success: false,
        code: 403,
        error: {
          process: 'handle -> AuthMiddleware',
          message: 'Acesso negado',
          details: [],
        },
      });
  });

  it('should return forbiden when decrypter returns error', async () => {
    app.get('/auth_test_decrypter_error', auth, (req: any, res) =>
      res.status(200).json(req.authenticatedUser),
    );

    const jwt = new JwtAdapter(appEnvironments.JWT_SECRET, '1ms');
    const token = await jwt.encrypt({ name: 'teste' });

    await request(app)
      .get('/auth_test_decrypter_error')
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(403, {
        success: false,
        code: 403,
        error: {
          process: 'handle -> AuthMiddleware',
          message: 'Acesso negado',
          details: [],
        },
      });
  });

  it('should return status 200 when token succeeds', async () => {
    app.get('/auth_test_succeed', auth, (req: any, res) =>
      res.status(200).json(req.authenticatedUser),
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
