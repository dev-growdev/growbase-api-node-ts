import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableRoles1676395725361 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          { name: 'uid', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          { name: 'description', type: 'varchar', length: '150', isNullable: false },
          { name: 'type', type: 'int', isNullable: false },
          { name: 'enable', type: 'boolean', default: true, isNullable: false },
          { name: 'created_at', type: 'timestamp', isNullable: false },
          { name: 'updated_at', type: 'timestamp', isNullable: false },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles', true, true, true);
  }
}
