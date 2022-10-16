import request from 'supertest';
import { ExampleDTOBuilder } from '@builders/example';
import { CreateExampleImp } from '@example/domain/usecases';
import { pgHelper } from '@shared/database/connections/pg-helper';
import { ExampleEntity } from '@shared/database/data/database/entities';
import app from '@main/config/app';

const makeRequest = () => ExampleDTOBuilder.init().builder();

describe('POST /examples', () => {
  beforeAll(async () => await pgHelper.connect());

  afterAll(async () => {
    await (await pgHelper.getRepository(ExampleEntity)).clear();
    await pgHelper.disconnect();
  });

  it('Should return 200', async () => {
    const body = makeRequest();

    await request(app)
      .post('/api/examples')
      .send(body)
      .expect(200)
      .expect(async (req) => {
        const repository = await pgHelper.getRepository(ExampleEntity);

        const example = await repository.findOneBy({ uid: req.body.data.uid });

        expect(example).toBeTruthy();

        expect(req.body.success).toBeTruthy();
        expect(req.body.data.uid).toBe(example?.uid);
        expect(req.body.data.name).toBe(body.name);
        expect(req.body.data.description).toBe(body.description);
      });
  });

  it('Should return 400 if body is invalid', async () => {
    const body = makeRequest();
    body.name = 'a';

    await request(app)
      .post('/api/examples')
      .send(body)
      .expect(400, {
        success: false,
        code: 400,
        error: {
          process: 'execute -> CreateExampleImp',
          message: 'Requisição inválida',
          details: [
            {
              name: 'name',
              description: 'Nome muito curto',
            },
          ],
        },
      });
  });

  it('Should return 500 if any unhandled errors happen', async () => {
    const body = makeRequest();

    jest.mock('@example/domain/usecases/create-example.usecase');

    jest.spyOn(CreateExampleImp.prototype, 'execute').mockRejectedValue(null);

    await request(app)
      .post('/api/examples')
      .send(body)
      .expect(500, {
        success: false,
        code: 500,
        error: {
          process: 'handle -> CreateExampleController',
          message: 'Aconteceu um erro inesperado, tente novamente ou entre em contato',
          details: [
            {
              name: 'stack',
              description: '',
            },
            {
              name: 'message',
              description: '',
            },
          ],
        },
      });

    jest.restoreAllMocks();
  });
});
