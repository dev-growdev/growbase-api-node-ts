import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTerms1676384180706 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'terms',
        columns: [
          { name: 'uid', type: 'uuid', isNullable: false, isPrimary: true },
          { name: 'title', type: 'varchar', length: '10', isNullable: false },
          { name: 'content', type: 'text', isNullable: false },
          { name: 'version', type: 'varchar', length: '10', isNullable: false },
          { name: 'enable', type: 'boolean', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('terms', true, true, true);
  }
}
