import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableAddresses1637069443891 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'street', type: 'varchar', length: '256', isNullable: false },
          { name: 'number', type: 'varchar', length: '10', isNullable: false },
          { name: 'complement', type: 'varchar', length: '256', isNullable: true },
          { name: 'post_code', type: 'varchar', length: '8', isNullable: false },
          { name: 'neighborhood', type: 'varchar', length: '50', isNullable: false },
          { name: 'city', type: 'varchar', length: '50', isNullable: false },
          { name: 'state', type: 'varchar', length: '2', isNullable: false },
          { name: 'latitude', type: 'decimal', scale: 8, precision: 10, isNullable: true },
          { name: 'longitude', type: 'decimal', scale: 8, precision: 11, isNullable: true },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses', true, true, true);
  }
}
