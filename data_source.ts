import { DataSource } from 'typeorm';
import { CustomLogger } from './src/common/app-logger';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'hiring_platform',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migration/*.{ts,js}'],
  migrationsTableName: 'migration',
});

const logger = new CustomLogger();

AppDataSource.initialize()
  .then(() => {
    logger.log('Data Source has been initialized!');
  })
  .catch(() => {
    logger.error('Error during Data Source initialization');
  });
