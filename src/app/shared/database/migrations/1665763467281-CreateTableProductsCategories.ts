import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableProductsCategories1665763467281 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products_categories',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'product_uid', type: 'uuid', isNullable: false },
          { name: 'category_uid', type: 'uuid', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['product_uid'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'products',
            name: 'fk_products_categories_products',
          }),
          new TableForeignKey({
            columnNames: ['category_uid'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'categories',
            name: 'fk_products_categories_categories',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products_categories', true, true, true);
  }
}
