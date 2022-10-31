import request from 'supertest';
import app from '@main/config/app';
import { pgHelper } from '@shared/database/connections/pg-helper';
import {
  CategoryEntity,
  FileEntity,
  ProfileDataEntity,
  UserEntity,
} from '@shared/database/entities';
import { CategoryDTO } from '@models/.';
import {
  CategoryEntityBuilder,
  FileEntityBuilder,
  ProfileDataEntityBuilder,
  UserEntityBuilder,
} from '@builders/shared';
import { JwtAdapter } from '@shared/adapters';
import { appEnvironments } from '@envs/.';
import { GetAllCategories } from '@categories/usecases';

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

describe('GET /categories', () => {
  let token: string;
  beforeAll(async () => {
    await pgHelper.connect();
    token = await makeToken();
  });

  afterAll(async () => {
    await pgHelper.client.manager.delete(UserEntity, {});
    await pgHelper.client.manager.delete(ProfileDataEntity, {});
    await pgHelper.disconnect();
  });

  it('Should return 200 with a fill array', async () => {
    const file = await FileEntityBuilder.init().builder();
    await CategoryEntityBuilder.init(file.uid).builder();
    await CategoryEntityBuilder.init(file.uid).withDescription('any_description').builder();

    const response = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const categories = response.body.data as CategoryDTO[];

    expect(response.body.success).toBeTruthy();
    expect(categories).toHaveLength(2);

    const categoryExpect = categories.find((c) => c.description);
    expect(categoryExpect?.uid).toBeDefined();
    expect(categoryExpect?.name).toEqual('any_name');
    expect(categoryExpect?.description).toEqual('any_description');
    expect(categoryExpect?.image).toEqual({
      uid: file.uid,
      url: 'any_key',
    });

    await pgHelper.client.manager.delete(CategoryEntity, {});
    await pgHelper.client.manager.delete(FileEntity, { uid: file.uid });
  });

  it('Should return 200 with empty list', async () => {
    const response = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const categories = response.body.data as CategoryDTO[];

    expect(response.body.success).toBeTruthy();
    expect(categories).toHaveLength(0);
  });

  it('Should return 500 if any unhandled errors happen', async () => {
    jest.mock('@categories/usecases/get-all-categories.usecase');

    jest.spyOn(GetAllCategories.prototype, 'execute').mockRejectedValue(null);

    await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .expect(500, {
        success: false,
        code: 500,
        error: {
          process: 'getAllCategories -> CategoryController',
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
