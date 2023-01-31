import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableUsers1637069462070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'login', type: 'varchar', length: '100', isNullable: false, isUnique: true },
          { name: 'password', type: 'varchar', length: '256', isNullable: false },
          { name: 'enable', type: 'boolean', default: true, isNullable: false },
          { name: 'verified', type: 'boolean', default: false, isNullable: false },
          { name: 'profile_uid', type: 'uuid', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['profile_uid'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'profiles_data',
            name: 'fk_users_profiles_data',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true, true, true);
  }
}
