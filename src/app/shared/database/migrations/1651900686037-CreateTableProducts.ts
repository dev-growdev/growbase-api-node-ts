import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableProducts1651900686037 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'enable', type: 'boolean', isNullable: false, default: true },
          { name: 'created_by_user_uid', type: 'uuid', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['created_by_user_uid'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'users',
            name: 'fk_products_users',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products', true, true, true);
  }
}
