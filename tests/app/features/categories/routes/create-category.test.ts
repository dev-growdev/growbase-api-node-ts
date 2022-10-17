import request from 'supertest';
import app from '@main/config/app';
import { pgHelper } from '@shared/database/connections/pg-helper';
import { CategoryEntity, ProfileDataEntity, UserEntity } from '@shared/database/entities';
import { CategoryDTO } from '@models/.';
import { ProfileDataEntityBuilder, UserEntityBuilder } from '@builders/shared';
import { JwtAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/.';
import { CreateCategory } from '@categories/usecases';

const makeRequest = () => ({
  name: 'any_name',
  description: 'any_description',
  image: {
    uid: '',
    url: 'any_url',
  },
});

const makeToken = async (): Promise<string> => {
  const profileData = await ProfileDataEntityBuilder.init().builder();
  const user = await UserEntityBuilder.init(profileData.uid, 'any_login').builder();
  const jwt = new JwtAdapter(appEnvironments.JWT_SECRET, appEnvironments.JWT_EXPIREIN);
  const token = await jwt.encrypt({
    userUid: user.uid,
    profileUid: profileData.uid,
  });

  return token;
};

describe('POST /categories', () => {
  let token: string;
  beforeAll(async () => {
    await pgHelper.connect();
    token = await makeToken();
  });

  afterAll(async () => {
    await pgHelper.client.manager.delete(CategoryEntity, {});
    await pgHelper.client.manager.delete(UserEntity, {});
    await pgHelper.client.manager.delete(ProfileDataEntity, {});
    await pgHelper.disconnect();
  });

  it('Should return 200 - with description', async () => {
    const body = makeRequest();

    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(200);

    const category = response.body.data as CategoryDTO;

    const categoryEntity = await pgHelper.client.manager.findOne(CategoryEntity, {
      where: { uid: category.uid },
    });

    expect(categoryEntity).toBeTruthy();

    expect(response.body.success).toBeTruthy();
    expect(category.name).toBe(categoryEntity?.name);
    expect(category.description).toBe(categoryEntity?.description);
    expect(category.enable).toBe(categoryEntity?.enable);
    expect(category.image.uid).toBe(categoryEntity?.file.uid);
    expect(category.image.url).toBeTruthy();
  });

  it('Should return 200 - without description', async () => {
    const body = makeRequest();
    body.description = undefined as any;

    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(200);

    const category = response.body.data as CategoryDTO;

    const categoryEntity = await pgHelper.client.manager.findOne(CategoryEntity, {
      where: { uid: category.uid },
    });

    expect(categoryEntity).toBeTruthy();
    expect(categoryEntity?.description).toBeFalsy();

    expect(response.body.success).toBeTruthy();
    expect(category.name).toBe(categoryEntity?.name);
    expect(category.description).toBeFalsy();
    expect(category.enable).toBe(categoryEntity?.enable);
    expect(category.image.uid).toBe(categoryEntity?.file.uid);
    expect(category.image.url).toBeTruthy();
  });

  it('Should return 400 if body is invalid because required fields are not provided', async () => {
    const body = makeRequest();
    body.name = undefined as any;
    body.image = undefined as any;

    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(400, {
        success: false,
        code: 400,
        error: {
          process: 'handle -> CreateOrUpdateCategoryValidator',
          message: 'Requisição inválida',
          details: [
            {
              name: 'Nome',
              description: 'Este campo é obrigatório',
            },
            {
              name: 'Imagem',
              description: 'Este campo é obrigatório',
            },
          ],
        },
      });
  });

  it('Should return 400 if body is invalid because long data', async () => {
    const body = makeRequest();
    body.name = ''.padEnd(101, 'a');
    body.description = ''.padEnd(201, 'a');
    body.image = {
      uid: '',
      url: undefined as any,
    };

    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(400, {
        success: false,
        code: 400,
        error: {
          process: 'handle -> CreateOrUpdateCategoryValidator',
          message: 'Requisição inválida',
          details: [
            {
              name: 'Nome',
              description: 'Tamanho máximo 100',
            },
            {
              name: 'Imagem',
              description: 'Este campo é obrigatório',
            },
            {
              name: 'Descrição',
              description: 'Tamanho máximo 200',
            },
          ],
        },
      });
  });

  it('Should return 500 if any unhandled errors happen', async () => {
    const body = makeRequest();

    jest.mock('@categories/usecases/create-category.usecase');

    jest.spyOn(CreateCategory.prototype, 'execute').mockRejectedValue(null);

    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(500, {
        success: false,
        code: 500,
        error: {
          process: 'createCategory -> CategoryController',
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

  it('Should return 500 - ensure rollback is called', async () => {
    const body = makeRequest();

    jest.mock('@shared/database/connections/pg-helper');

    jest.spyOn(pgHelper, 'commit').mockRejectedValue(null);
    const rollbackObserver = jest.spyOn(pgHelper, 'rollback').mockResolvedValue();

    await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(500, {
        success: false,
        code: 500,
        error: {
          process: 'createCategory -> CategoryController',
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

    expect(rollbackObserver).toHaveBeenCalledTimes(1);
    jest.restoreAllMocks();
  });
});
