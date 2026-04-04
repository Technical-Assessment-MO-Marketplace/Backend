import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1704153600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed admin user
    // Password: "admin" (bcrypt hashed with 10 salt rounds)
    const adminInsertQuery = `
      INSERT INTO users (name, email, password, role_id, created_at) VALUES
      ('Admin User', 'admin@mail.com', '$2b$10$Z8PJOUo.eZkBSI3uufb0tOXsg/2WO48LyUowAOW85K8aOr5cP1tOu', 1, CURRENT_TIMESTAMP)
    `;
    await queryRunner.query(adminInsertQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete admin user
    await queryRunner.query("DELETE FROM users WHERE email = 'admin@mail.com'");

    // Reset sequences/auto-increment
    await queryRunner.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
  }
}
