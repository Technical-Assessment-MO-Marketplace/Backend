import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddNameColumnToUsers1704240000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
