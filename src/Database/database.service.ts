import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      if (this.dataSource.isInitialized) {
        const options = this.dataSource.options as any;
        const dbName = options.database || 'mo_markrtplace';
        const dbHost = options.host || new URL(options.url).hostname;

        console.log('DATABASE CONNECTION SUCCESSFUL');
        console.log(`Database: ${dbName}`);
        console.log(`Host: ${dbHost}`);
        console.log(`Type: ${options.type}`);
        console.log(`SSL: ${options.ssl ? 'Enabled' : 'Disabled'}`);

        await this.runMigrations();
      }
    } catch (error) {
      console.error('DATABASE CONNECTION FAILED');
      console.error(error);
      process.exit(1);
    }
  }

  async runMigrations(): Promise<void> {
    try {
      console.log('Running database migrations...\n');
      const migrations = await this.dataSource.runMigrations();

      if (migrations.length > 0) {
        console.log('Migrations executed successfully:');
        migrations.forEach((migration, index) => {
          console.log(`   ${index + 1}. ${migration.name}`);
        });
      } else {
        console.log('No pending migrations to run.');
      }
    } catch (error) {
      console.error('MIGRATION FAILED');
      console.error(error);
      throw error;
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
