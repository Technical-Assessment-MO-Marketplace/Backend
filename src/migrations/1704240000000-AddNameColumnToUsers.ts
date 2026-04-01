import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddNameColumnToUsers1704240000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add name column if it doesn't already exist
    const table = await queryRunner.getTable('users');
    const hasNameColumn = table?.columns.some((col) => col.name === 'name');

    if (!hasNameColumn) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'name',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop name column if it exists
    const table = await queryRunner.getTable('users');
    const hasNameColumn = table?.columns.some((col) => col.name === 'name');

    if (hasNameColumn) {
      await queryRunner.dropColumn('users', 'name');
    }
  }
}
