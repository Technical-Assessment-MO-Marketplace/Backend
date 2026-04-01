"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedInitialData1704153600000 = void 0;
class SeedInitialData1704153600000 {
    async up(queryRunner) {
        await queryRunner.query(`
      INSERT INTO roles (id, name) VALUES
      (1, 'admin'),
      (2, 'user')
    `);
        await queryRunner.query(`
      INSERT INTO users (email, password, role_id, created_at) VALUES
      ('admin@mail.com', '$2b$10$vavNqN9T.VhUYhN4eXpYge77TBkXUvv5/wNQxkMnqEbEJ1lJEFIZi', 1, CURRENT_TIMESTAMP)
    `);
        await queryRunner.query(`
      INSERT INTO attributes (id, name) VALUES
      (1, 'Color'),
      (2, 'Size'),
      (3, 'Material')
    `);
        await queryRunner.query(`
      INSERT INTO attribute_values (attribute_id, value) VALUES
      (1, 'Red'),
      (1, 'Blue')
    `);
        await queryRunner.query(`
      INSERT INTO attribute_values (attribute_id, value) VALUES
      (2, 'M'),
      (2, 'L')
    `);
        await queryRunner.query(`
      INSERT INTO attribute_values (attribute_id, value) VALUES
      (3, 'Cotton'),
      (3, 'Polyester')
    `);
    }
    async down(queryRunner) {
        await queryRunner.query('DELETE FROM attribute_values');
        await queryRunner.query('DELETE FROM attributes');
        await queryRunner.query('DELETE FROM users');
        await queryRunner.query('DELETE FROM roles');
        await queryRunner.query('ALTER SEQUENCE roles_id_seq RESTART WITH 1');
        await queryRunner.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
        await queryRunner.query('ALTER SEQUENCE attributes_id_seq RESTART WITH 1');
        await queryRunner.query('ALTER SEQUENCE attribute_values_id_seq RESTART WITH 1');
    }
}
exports.SeedInitialData1704153600000 = SeedInitialData1704153600000;
//# sourceMappingURL=1704153600000-SeedInitialData.js.map