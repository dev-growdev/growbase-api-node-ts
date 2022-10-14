import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableProductsFiles1665763581352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products_files',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'product_uid', type: 'uuid', isNullable: false },
          { name: 'file_uid', type: 'uuid', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['product_uid'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'products',
            name: 'fk_products_files_products',
          }),
          new TableForeignKey({
            columnNames: ['file_uid'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'files',
            name: 'fk_products_files_files',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products_files', true, true, true);
  }
}
