import supertest from 'supertest';
import app from '@main/config/app';
import { noCache } from '@main/middlewares';

describe('NoCache Middleware', () => {
  it('should disable cache', async () => {
    app.post('/test_no_cache', noCache, (_, res) => res.send());

    await supertest(app)
      .post('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store');
  });
});
