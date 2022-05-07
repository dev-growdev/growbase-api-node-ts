import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableProfilesData1637069455689 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'profiles_data',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'name', type: 'varchar', length: '150', isNullable: false },
          { name: 'email', type: 'varchar', length: '100', isNullable: false },
          { name: 'type_profile', type: 'varchar', length: '20', isNullable: false },
          { name: 'phone', type: 'varchar', length: '11', isNullable: true },
          { name: 'document', type: 'varchar', length: '14', isNullable: true, isUnique: true },
          { name: 'uid_address', type: 'uuid', isNullable: true },
          { name: 'uid_file', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['uid_address'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'addresses',
            name: 'profiles_data_addresses',
          }),
          new TableForeignKey({
            columnNames: ['uid_file'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'files',
            name: 'profiles_data_files',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('profiles_data', true, true, true);
  }
}
