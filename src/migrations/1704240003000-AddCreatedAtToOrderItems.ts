import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCreatedAtToOrderItems1704240003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column already exists
    const table = await queryRunner.getTable('order_items');
    const hasCreatedAtColumn = table?.columns.some(
      (column) => column.name === 'created_at',
    );

    if (!hasCreatedAtColumn) {
      // Add created_at column
      await queryRunner.addColumn(
        'order_items',
        new TableColumn({
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          isNullable: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove created_at column
    const table = await queryRunner.getTable('order_items');
    const hasCreatedAtColumn = table?.columns.some(
      (column) => column.name === 'created_at',
    );

    if (hasCreatedAtColumn) {
      await queryRunner.dropColumn('order_items', 'created_at');
    }
  }
}
