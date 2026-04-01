import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1704153600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed roles
    await queryRunner.query(`
      INSERT INTO roles (id, name) VALUES
      (1, 'admin'),
      (2, 'user')
    `);

    // Seed admin user
    // Password: "admin" (bcrypt hashed)
    await queryRunner.query(`
      INSERT INTO users (email, password, role_id, created_at) VALUES
      ('admin@mail.com', '$2b$10$vavNqN9T.VhUYhN4eXpYge77TBkXUvv5/wNQxkMnqEbEJ1lJEFIZi', 1, CURRENT_TIMESTAMP)
    `);

    // Seed attributes
    await queryRunner.query(`
      INSERT INTO attributes (id, name) VALUES
      (1, 'Color'),
      (2, 'Size'),
      (3, 'Material')
    `);

    // Seed attribute values
    // Colors
    await queryRunner.query(`
      INSERT INTO attribute_values (attribute_id, value) VALUES
      (1, 'Red'),
      (1, 'Blue')
    `);

    // Sizes
    await queryRunner.query(`
      INSERT INTO attribute_values (attribute_id, value) VALUES
      (2, 'M'),
      (2, 'L')
    `);

    // Materials
    await queryRunner.query(`
      INSERT INTO attribute_values (attribute_id, value) VALUES
      (3, 'Cotton'),
      (3, 'Polyester')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse order of insertion due to foreign key constraints
    await queryRunner.query('DELETE FROM attribute_values');
    await queryRunner.query('DELETE FROM attributes');
    await queryRunner.query('DELETE FROM users');
    await queryRunner.query('DELETE FROM roles');

    // Reset sequences/auto-increment
    await queryRunner.query('ALTER SEQUENCE roles_id_seq RESTART WITH 1');
    await queryRunner.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await queryRunner.query('ALTER SEQUENCE attributes_id_seq RESTART WITH 1');
    await queryRunner.query(
      'ALTER SEQUENCE attribute_values_id_seq RESTART WITH 1',
    );
  }
}
