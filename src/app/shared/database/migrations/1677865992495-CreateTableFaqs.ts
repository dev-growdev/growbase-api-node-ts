import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableFaqs1677865992495 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'faqs',
        columns: [
          { name: 'uid', type: 'uuid', isNullable: false, isPrimary: true },
          { name: 'question', type: 'varchar', length: '150', isNullable: false },
          { name: 'answer', type: 'text', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('faqs', true, true, true);
  }
}
