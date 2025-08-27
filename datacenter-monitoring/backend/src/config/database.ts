import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Rack, Server, Alert, NetworkDevice } from '../entities';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'datacenter',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'datacenter',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [Rack, Server, Alert, NetworkDevice],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Running in development mode - entities will be synchronized');
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
};