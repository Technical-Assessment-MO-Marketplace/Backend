import { DataSourceOptions } from 'typeorm';

export const getDatabaseConfig = (): DataSourceOptions => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const dbUrl =
    nodeEnv === 'production'
      ? process.env.DATABASE_EXTERNAL_URL
      : process.env.DATABASE_URL;

  if (dbUrl) {
    return {
      type: 'postgres',
      url: dbUrl,
      entities: ['dist/**/*.entity.js'],
      subscribers: ['dist/**/*.subscriber.js'],
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true, // Run migrations automatically on startup
      migrationsTransactionMode: 'each', // Each migration in its own transaction
      synchronize: false,
      logging: nodeEnv === 'development',
      ssl:
        process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    } as DataSourceOptions;
  }

  // Fall back to individual environment variables
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
    migrationsRun: true, // Run migrations automatically on startup
    migrationsTransactionMode: 'each', // Each migration in its own transaction
    synchronize: false,
    logging: nodeEnv === 'development',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  } as DataSourceOptions;
};
