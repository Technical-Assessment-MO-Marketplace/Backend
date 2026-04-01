import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './Database/database.service';

@Module({
  imports: [TypeOrmModule.forRoot(getDatabaseConfig())],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
