import { DataSource, QueryRunner } from 'typeorm';
import configDataSource from '../../../../../../ormconfig';

export const pgHelper = {
  client: null as unknown as DataSource,
  queryRunner: null as unknown as QueryRunner,
  async connect(): Promise<void> {
    /* istanbul ignore next */
    this.client = new DataSource(configDataSource);
    await this.client.initialize();
  },
  async disconnect(): Promise<void> {
    await this.client.destroy();
    this.client = null as any;
  },
  async openTransaction(): Promise<void> {
    if (!this.client || !this.client.isInitialized) await this.connect();
    this.queryRunner = this.client.createQueryRunner();
    await this.queryRunner.startTransaction();
  },
  async commit(): Promise<void> {
    if (!this.queryRunner) throw new Error('Transaction not opened');
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
    this.queryRunner = null as any;
  },
  async rollback(): Promise<void> {
    if (!this.queryRunner) throw new Error('Transaction not opened');
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    this.queryRunner = null as any;
  },
};
