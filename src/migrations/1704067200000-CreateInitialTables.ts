import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateInitialTables1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop tables if they exist (for clean migration re-runs)
    const tableNames = [
      'order_items',
      'orders',
      'variant_attributes',
      'variants',
      'attribute_values',
      'attributes',
      'products',
      'users',
      'roles',
    ];
    for (const tableName of tableNames) {
      const table = await queryRunner.getTable(tableName);
      if (table) {
        await queryRunner.dropTable(tableName);
      }
    }

    // Create roles table
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key for users.role_id -> roles.id
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL',
      }),
    );

    // Create products table
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key for products.created_by -> users.id
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create attributes table
    await queryRunner.createTable(
      new Table({
        name: 'attributes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create attribute_values table
    await queryRunner.createTable(
      new Table({
        name: 'attribute_values',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'attribute_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
        ],
        uniques: [
          new TableUnique({
            columnNames: ['attribute_id', 'value'],
            name: 'UQ_attribute_id_value',
          }),
        ],
      }),
      true,
    );

    // Add foreign key for attribute_values.attribute_id -> attributes.id
    await queryRunner.createForeignKey(
      'attribute_values',
      new TableForeignKey({
        columnNames: ['attribute_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'attributes',
        onDelete: 'CASCADE',
      }),
    );

    // Create variants table
    await queryRunner.createTable(
      new Table({
        name: 'variants',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'product_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'combination_key',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'stock',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        uniques: [
          new TableUnique({
            columnNames: ['product_id', 'combination_key'],
            name: 'UQ_product_id_combination_key',
          }),
        ],
      }),
      true,
    );

    // Add foreign key for variants.product_id -> products.id
    await queryRunner.createForeignKey(
      'variants',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'CASCADE',
      }),
    );

    // Create variant_attributes table
    await queryRunner.createTable(
      new Table({
        name: 'variant_attributes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'variant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'attribute_value_id',
            type: 'int',
            isNullable: false,
          },
        ],
        uniques: [
          new TableUnique({
            columnNames: ['variant_id', 'attribute_value_id'],
            name: 'UQ_variant_id_attribute_value_id',
          }),
        ],
      }),
      true,
    );

    // Add foreign keys for variant_attributes
    await queryRunner.createForeignKey(
      'variant_attributes',
      new TableForeignKey({
        columnNames: ['variant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'variants',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'variant_attributes',
      new TableForeignKey({
        columnNames: ['attribute_value_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'attribute_values',
        onDelete: 'CASCADE',
      }),
    );

    // Create orders table
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total_amount',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key for orders.user_id -> users.id
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create order_items table
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'order_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'variant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'float',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add foreign keys for order_items
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['variant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'variants',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes for foreign keys and common queries
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        columnNames: ['role_id'],
        name: 'IDX_users_role_id',
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        columnNames: ['email'],
        name: 'IDX_users_email',
      }),
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        columnNames: ['created_by'],
        name: 'IDX_products_created_by',
      }),
    );

    await queryRunner.createIndex(
      'variants',
      new TableIndex({
        columnNames: ['product_id'],
        name: 'IDX_variants_product_id',
      }),
    );

    await queryRunner.createIndex(
      'attribute_values',
      new TableIndex({
        columnNames: ['attribute_id'],
        name: 'IDX_attribute_values_attribute_id',
      }),
    );

    await queryRunner.createIndex(
      'variant_attributes',
      new TableIndex({
        columnNames: ['variant_id'],
        name: 'IDX_variant_attributes_variant_id',
      }),
    );

    await queryRunner.createIndex(
      'variant_attributes',
      new TableIndex({
        columnNames: ['attribute_value_id'],
        name: 'IDX_variant_attributes_attribute_value_id',
      }),
    );

    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        columnNames: ['user_id'],
        name: 'IDX_orders_user_id',
      }),
    );

    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        columnNames: ['status'],
        name: 'IDX_orders_status',
      }),
    );

    await queryRunner.createIndex(
      'order_items',
      new TableIndex({
        columnNames: ['order_id'],
        name: 'IDX_order_items_order_id',
      }),
    );

    await queryRunner.createIndex(
      'order_items',
      new TableIndex({
        columnNames: ['product_id'],
        name: 'IDX_order_items_product_id',
      }),
    );

    await queryRunner.createIndex(
      'order_items',
      new TableIndex({
        columnNames: ['variant_id'],
        name: 'IDX_order_items_variant_id',
      }),
    );

    // Seed roles
    await queryRunner.query(`
      INSERT INTO roles (id, name) VALUES
      (1, 'admin'),
      (2, 'user')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete seed data
    await queryRunner.query('DELETE FROM attribute_values');
    await queryRunner.query('DELETE FROM attributes');
    await queryRunner.query('DELETE FROM roles');

    // Drop indexes
    await queryRunner.dropIndex('order_items', 'IDX_order_items_variant_id');
    await queryRunner.dropIndex('order_items', 'IDX_order_items_order_id');
    await queryRunner.dropIndex('order_items', 'IDX_order_items_product_id');
    await queryRunner.dropIndex('orders', 'IDX_orders_status');
    await queryRunner.dropIndex('orders', 'IDX_orders_user_id');
    await queryRunner.dropIndex(
      'variant_attributes',
      'IDX_variant_attributes_attribute_value_id',
    );
    await queryRunner.dropIndex(
      'variant_attributes',
      'IDX_variant_attributes_variant_id',
    );
    await queryRunner.dropIndex(
      'attribute_values',
      'IDX_attribute_values_attribute_id',
    );
    await queryRunner.dropIndex('variants', 'IDX_variants_product_id');
    await queryRunner.dropIndex('products', 'IDX_products_created_by');
    await queryRunner.dropIndex('users', 'IDX_users_email');
    await queryRunner.dropIndex('users', 'IDX_users_role_id');

    // Drop tables in reverse order of creation
    await queryRunner.dropTable('order_items');
    await queryRunner.dropTable('orders');
    await queryRunner.dropTable('variant_attributes');
    await queryRunner.dropTable('variants');
    await queryRunner.dropTable('attribute_values');
    await queryRunner.dropTable('attributes');
    await queryRunner.dropTable('products');
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('roles');
  }
}
