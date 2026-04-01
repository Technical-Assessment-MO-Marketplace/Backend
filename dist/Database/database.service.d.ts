import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class DatabaseService implements OnModuleInit {
    private dataSource;
    constructor(dataSource: DataSource);
    onModuleInit(): Promise<void>;
    runMigrations(): Promise<void>;
    getDataSource(): DataSource;
}
