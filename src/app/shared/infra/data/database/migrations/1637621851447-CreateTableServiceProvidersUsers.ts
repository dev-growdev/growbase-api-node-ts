import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableServiceProvidersUsers1637621851447 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'service_providers_users',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'uid_service_provider', type: 'uuid', isNullable: false },
          { name: 'uid_user', type: 'uuid', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['uid_user'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'users',
            name: 'service_providers_users_users',
          }),
          new TableForeignKey({
            columnNames: ['uid_service_provider'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'service_providers',
            name: 'service_providers_users_service_providers',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('service_providers_users', true, true, true);
  }
}
