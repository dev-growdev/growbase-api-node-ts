import { Repository } from 'typeorm';
import { pgHelper as sut } from '@shared/infra/data/connections/pg-helper';
import { UserEntity } from '@shared/infra/data/database/entities';

describe('Pg Helper Connection', () => {
  it('should open and close the connection', async () => {
    expect(sut.client).toBeFalsy();

    await sut.connect();

    expect(sut.client).toBeTruthy();
    expect(sut.client.isInitialized).toBeTruthy();

    await sut.disconnect();

    expect(sut.client).toBeFalsy();
  });

  it('Should get repository if connection is up', async () => {
    await sut.connect();
    const repository = await sut.getRepository(UserEntity);
    expect(repository).toBeInstanceOf(Repository);

    await sut.disconnect();
    expect(sut.client).toBeFalsy();
  });

  it('Should reconnect if postgresql is down and get repository', async () => {
    const repository = await sut.getRepository(UserEntity);
    expect(repository).toBeInstanceOf(Repository);

    await sut.disconnect();
    expect(sut.client).toBeFalsy();
  });
});
