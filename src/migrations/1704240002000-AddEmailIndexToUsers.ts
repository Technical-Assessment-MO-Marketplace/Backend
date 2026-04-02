import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddEmailIndexToUsers1704240002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if index already exists
    const table = await queryRunner.getTable('users');
    const hasEmailIndex = table?.indices.some((idx) =>
      idx.columnNames.includes('email'),
    );

    if (!hasEmailIndex) {
      await queryRunner.createIndex(
        'users',
        new TableIndex({
          columnNames: ['email'],
          name: 'IDX_users_email',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const index = table?.indices.find((idx) =>
      idx.columnNames.includes('email'),
    );

    if (index) {
      await queryRunner.dropIndex('users', index);
    }
  }
}
