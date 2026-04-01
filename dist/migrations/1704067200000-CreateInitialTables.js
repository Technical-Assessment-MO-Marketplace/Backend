"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialTables1704067200000 = void 0;
const typeorm_1 = require("typeorm");
class CreateInitialTables1704067200000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('users', new typeorm_1.TableForeignKey({
            columnNames: ['role_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'roles',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('products', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
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
                new typeorm_1.TableUnique({
                    columnNames: ['attribute_id', 'value'],
                    name: 'UQ_attribute_id_value',
                }),
            ],
        }), true);
        await queryRunner.createForeignKey('attribute_values', new typeorm_1.TableForeignKey({
            columnNames: ['attribute_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'attributes',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
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
                new typeorm_1.TableUnique({
                    columnNames: ['product_id', 'combination_key'],
                    name: 'UQ_product_id_combination_key',
                }),
            ],
        }), true);
        await queryRunner.createForeignKey('variants', new typeorm_1.TableForeignKey({
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
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
                new typeorm_1.TableUnique({
                    columnNames: ['variant_id', 'attribute_value_id'],
                    name: 'UQ_variant_id_attribute_value_id',
                }),
            ],
        }), true);
        await queryRunner.createForeignKey('variant_attributes', new typeorm_1.TableForeignKey({
            columnNames: ['variant_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'variants',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('variant_attributes', new typeorm_1.TableForeignKey({
            columnNames: ['attribute_value_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'attribute_values',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('orders', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('order_items', new typeorm_1.TableForeignKey({
            columnNames: ['order_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'orders',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('order_items', new typeorm_1.TableForeignKey({
            columnNames: ['variant_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'variants',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('users', new typeorm_1.TableIndex({
            columnNames: ['role_id'],
            name: 'IDX_users_role_id',
        }));
        await queryRunner.createIndex('products', new typeorm_1.TableIndex({
            columnNames: ['created_by'],
            name: 'IDX_products_created_by',
        }));
        await queryRunner.createIndex('variants', new typeorm_1.TableIndex({
            columnNames: ['product_id'],
            name: 'IDX_variants_product_id',
        }));
        await queryRunner.createIndex('attribute_values', new typeorm_1.TableIndex({
            columnNames: ['attribute_id'],
            name: 'IDX_attribute_values_attribute_id',
        }));
        await queryRunner.createIndex('variant_attributes', new typeorm_1.TableIndex({
            columnNames: ['variant_id'],
            name: 'IDX_variant_attributes_variant_id',
        }));
        await queryRunner.createIndex('variant_attributes', new typeorm_1.TableIndex({
            columnNames: ['attribute_value_id'],
            name: 'IDX_variant_attributes_attribute_value_id',
        }));
        await queryRunner.createIndex('orders', new typeorm_1.TableIndex({
            columnNames: ['user_id'],
            name: 'IDX_orders_user_id',
        }));
        await queryRunner.createIndex('orders', new typeorm_1.TableIndex({
            columnNames: ['status'],
            name: 'IDX_orders_status',
        }));
        await queryRunner.createIndex('order_items', new typeorm_1.TableIndex({
            columnNames: ['order_id'],
            name: 'IDX_order_items_order_id',
        }));
        await queryRunner.createIndex('order_items', new typeorm_1.TableIndex({
            columnNames: ['variant_id'],
            name: 'IDX_order_items_variant_id',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('order_items', 'IDX_order_items_variant_id');
        await queryRunner.dropIndex('order_items', 'IDX_order_items_order_id');
        await queryRunner.dropIndex('orders', 'IDX_orders_status');
        await queryRunner.dropIndex('orders', 'IDX_orders_user_id');
        await queryRunner.dropIndex('variant_attributes', 'IDX_variant_attributes_attribute_value_id');
        await queryRunner.dropIndex('variant_attributes', 'IDX_variant_attributes_variant_id');
        await queryRunner.dropIndex('attribute_values', 'IDX_attribute_values_attribute_id');
        await queryRunner.dropIndex('variants', 'IDX_variants_product_id');
        await queryRunner.dropIndex('products', 'IDX_products_created_by');
        await queryRunner.dropIndex('users', 'IDX_users_role_id');
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
exports.CreateInitialTables1704067200000 = CreateInitialTables1704067200000;
//# sourceMappingURL=1704067200000-CreateInitialTables.js.map