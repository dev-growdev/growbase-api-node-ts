import { pgHelper as sut } from '@shared/database/connections/pg-helper';

describe('Pg Helper Connection', () => {
  it('should open and close the connection', async () => {
    expect(sut.client).toBeFalsy();

    await sut.connect();

    expect(sut.client).toBeTruthy();
    expect(sut.client.isInitialized).toBeTruthy();

    await sut.disconnect();

    expect(sut.client).toBeFalsy();
  });

  it('should open and close transaction', async () => {
    await sut.connect();

    await sut.openTransaction();

    expect(sut.queryRunner).toBeTruthy();
    expect(sut.queryRunner.isTransactionActive).toBeTruthy();

    await sut.commit();

    expect(sut.queryRunner).toBeFalsy();

    await sut.disconnect();
  });

  it('should open and close transaction if connection is closed', async () => {
    await sut.openTransaction();

    expect(sut.queryRunner).toBeTruthy();
    expect(sut.queryRunner.isTransactionActive).toBeTruthy();

    await sut.rollback();

    expect(sut.queryRunner).toBeFalsy();

    await sut.disconnect();
  });

  it('should open and close transaction throws errors', async () => {
    await sut.connect();

    await expect(sut.commit()).rejects.toThrowError('Transaction not opened');

    await expect(sut.rollback()).rejects.toThrowError('Transaction not opened');
  });
});
