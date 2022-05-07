import { redisHelper as sut } from '@shared/infra/data/connections/redis-helper';

jest.mock('ioredis', () => require('ioredis-mock/jest'));

describe('Redis Helper Connection', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should open and close the connection', async () => {
    expect(sut.client).toBeFalsy();

    await sut.connect('');

    expect(sut.client).toBeTruthy();

    await sut.disconnect();

    expect(sut.client).toBeFalsy();
  });

  it('should test actions redis', async () => {
    await sut.connect('');

    // adiciona key
    const setSuccess = await sut.set('any_key', 'any_value');
    expect(setSuccess).toBeTruthy();

    // verificar se a chave foi adicionada
    const resultExists = await sut.exists('any_key');
    expect(resultExists).toBeTruthy();

    // recupera key adicionada
    const result = await sut.get<string>('any_key');
    expect(result).toBeTruthy();
    expect(result).toBe('any_value');

    // tenta buscar uma chave que não existe
    const noResult = await sut.get<string>('any_key_2');
    expect(noResult).toBeFalsy();

    // deleta chave adicionada
    const delSuccess = await sut.del('any_key');
    expect(delSuccess).toBeTruthy();

    // tenta recupera a chave delatada para garantir
    const getAfterDel = await sut.get<string>('any_key');
    expect(getAfterDel).toBeFalsy();
    const verifyExistsfterDel = await sut.exists('any_key');
    expect(verifyExistsfterDel).toBeFalsy();

    // adiciona key com expiracao
    const setExSuccess = await sut.setex('any_key_ex', 'any_value', 200);
    expect(setExSuccess).toBeTruthy();

    const setExExists = await sut.exists('any_key_ex');
    expect(setExExists).toBeTruthy();

    await sut.disconnect();
  });
});
