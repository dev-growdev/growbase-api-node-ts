import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableProducts1639010827820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          { name: 'price', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'type', type: 'varchar', length: '100', isNullable: false },
          { name: 'uid_service_provider', type: 'uuid', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['uid_service_provider'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'service_providers',
            name: 'products_service_providers',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products', true, true, true);
  }
}
