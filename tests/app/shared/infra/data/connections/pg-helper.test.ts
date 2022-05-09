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

  it('Should get repository if connection is up and transaction is open', async () => {
    await sut.connect();
    await sut.openTransaction();

    const repository = await sut.getRepository(UserEntity);
    expect(repository).toBeInstanceOf(Repository);

    await sut.closeTransaction();
    await sut.disconnect();
    expect(sut.client).toBeFalsy();
  });

  it('should open and close transaction', async () => {
    await sut.connect();

    await sut.openTransaction();

    expect(sut.queryRunner).toBeTruthy();
    expect(sut.queryRunner.isTransactionActive).toBeTruthy();

    await sut.commit();

    await sut.closeTransaction();

    expect(sut.queryRunner).toBeFalsy();

    await sut.disconnect();
  });

  it('should open and close transaction if connection is closed', async () => {
    await sut.openTransaction();

    expect(sut.queryRunner).toBeTruthy();
    expect(sut.queryRunner.isTransactionActive).toBeTruthy();

    await sut.rollback();

    await sut.closeTransaction();

    expect(sut.queryRunner).toBeFalsy();

    await sut.disconnect();
  });

  it('should open and close transaction throws errors', async () => {
    await sut.connect();

    await expect(sut.closeTransaction()).rejects.toThrowError('Transaction not opened');

    await expect(sut.commit()).rejects.toThrowError('Transaction not opened');

    await expect(sut.rollback()).rejects.toThrowError('Transaction not opened');
  });
});
