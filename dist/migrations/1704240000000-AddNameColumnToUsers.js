"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNameColumnToUsers1704240000000 = void 0;
const typeorm_1 = require("typeorm");
class AddNameColumnToUsers1704240000000 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('users');
        const hasNameColumn = table?.columns.some((col) => col.name === 'name');
        if (!hasNameColumn) {
            await queryRunner.addColumn('users', new typeorm_1.TableColumn({
                name: 'name',
                type: 'varchar',
                isNullable: true,
            }));
        }
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('users');
        const hasNameColumn = table?.columns.some((col) => col.name === 'name');
        if (hasNameColumn) {
            await queryRunner.dropColumn('users', 'name');
        }
    }
}
exports.AddNameColumnToUsers1704240000000 = AddNameColumnToUsers1704240000000;
//# sourceMappingURL=1704240000000-AddNameColumnToUsers.js.map