import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from '../config';

export const AppDataSource = new DataSource(getDatabaseConfig());
