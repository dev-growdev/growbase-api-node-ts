import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableExample1651900686037 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'examples',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('examples', true, true, true);
  }
}
