import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddProductIdToOrderItems1704240001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column already exists
    const table = await queryRunner.getTable('order_items');
    const hasProductIdColumn = table?.columns.some(
      (column) => column.name === 'product_id',
    );

    if (!hasProductIdColumn) {
      // Add product_id column
      await queryRunner.addColumn(
        'order_items',
        new TableColumn({
          name: 'product_id',
          type: 'int',
          isNullable: true, // Keep nullable for migration
        }),
      );

      // Add foreign key for product_id
      await queryRunner.createForeignKey(
        'order_items',
        new TableForeignKey({
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'CASCADE',
        }),
      );

      // Add index for product_id
      await queryRunner.createIndex(
        'order_items',
        new TableIndex({
          columnNames: ['product_id'],
          name: 'IDX_order_items_product_id',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_items');
    const hasProductIdColumn = table?.columns.some(
      (column) => column.name === 'product_id',
    );

    if (hasProductIdColumn) {
      // Drop foreign key
      const foreignKey = table?.foreignKeys.find(
        (fk) =>
          fk.columnNames.includes('product_id') &&
          fk.referencedTableName === 'products',
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey('order_items', foreignKey);
      }

      // Drop index
      const index = table?.indices.find((idx) =>
        idx.columnNames.includes('product_id'),
      );

      if (index) {
        await queryRunner.dropIndex('order_items', index);
      }

      // Drop column
      await queryRunner.dropColumn('order_items', 'product_id');
    }
  }
}
