"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const dbUrl = nodeEnv === 'production'
        ? process.env.DATABASE_EXTERNAL_URL
        : process.env.DATABASE_URL;
    if (dbUrl) {
        return {
            type: 'postgres',
            url: dbUrl,
            entities: ['dist/**/*.entity.js'],
            subscribers: ['dist/**/*.subscriber.js'],
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,
            migrationsTransactionMode: 'each',
            synchronize: false,
            logging: nodeEnv === 'development',
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        };
    }
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: ['dist/**/*.entity.js'],
        subscribers: ['dist/**/*.subscriber.js'],
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
        migrationsTransactionMode: 'each',
        synchronize: false,
        logging: nodeEnv === 'development',
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map