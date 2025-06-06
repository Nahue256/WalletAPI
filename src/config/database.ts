import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { WalletEntity } from '../entities/wallet.entity';

const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'express_db',
  synchronize: true,
  dropSchema: isTest,  // Only drop schema in test environment
  logging: false,
  entities: [UserEntity, WalletEntity],
  subscribers: [],
  migrations: []
}); 