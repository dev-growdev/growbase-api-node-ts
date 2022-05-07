import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableFiles1637069449464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          { name: 'uid', type: 'uuid', isNullable: false, isPrimary: true },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          { name: 'file_path', type: 'varchar', isNullable: false },
          { name: 's3_key', type: 'varchar', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('files', true, true, true);
  }
}
