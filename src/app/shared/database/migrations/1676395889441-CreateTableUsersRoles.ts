import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableUsersRoles1676395889441 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_roles',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'user_uid', type: 'uuid', isNullable: false },
          { name: 'role_uid', type: 'uuid', isNullable: false },
          { name: 'actions', type: 'json', isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['user_uid'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'users',
            name: 'user_roles_users',
          }),
          new TableForeignKey({
            columnNames: ['role_uid'],
            referencedColumnNames: ['uid'],
            referencedTableName: 'roles',
            name: 'user_roles_roles',
          }),
        ],
        uniques: [
          {
            columnNames: ['user_uid', 'role_uid'],
            name: 'un_users_roles',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_roles', true, true, true);
  }
}
