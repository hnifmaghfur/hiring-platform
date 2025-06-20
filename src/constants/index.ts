import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmCustomLogger } from '../common/typeorm-logger';

// Constants untuk aplikasi
export const APP_CONFIG = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PREFIX: process.env.API_PREFIX || 'api',
  APP_NAME: process.env.APP_NAME || 'NestJS App',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
} as const;

// Constants untuk database
export const DATABASE_CONFIG = {
  HOST: process.env.DB_HOST,
  PORT: Number(process.env.DB_PORT) || 5432,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  NAME: process.env.DB_NAME,
  SSL: process.env.DB_SSL === 'true',
  LOGGING: process.env.DB_LOGGING === 'true',
  SYNCHRONIZE: process.env.DB_SYNCHRONIZE === 'true',
  MAX_CONNECTIONS: Number(process.env.DB_MAX_CONNECTIONS) || 10,
  CONNECTION_TIMEOUT: Number(process.env.DB_CONNECTION_TIMEOUT) || 60000,
} as const;

// Constants untuk JWT (jika menggunakan authentication)
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  REFRESH_TOKEN_RANDOM: process.env.JWT_REFRESH_TOKEN_RANDOM || 'random',
} as const;

// Constants untuk redis
export const REDIS_CONFIG = {
  HOST: process.env.REDIS_HOST,
  PORT: Number(process.env.REDIS_PORT) || 6379,
  PASSWORD: process.env.REDIS_PASSWORD,
  MAX_CONNECTIONS: Number(process.env.REDIS_MAX_CONNECTIONS) || 10,
  CONNECTION_TIMEOUT: Number(process.env.REDIS_CONNECTION_TIMEOUT) || 60000,
} as const;

// Constants untuk CORS
export const CORS_CONFIG = {
  ORIGIN: process.env.CORS_ORIGIN || '*',
  METHODS: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
} as const;

// Constants untuk rate limiting
export const RATE_LIMIT_CONFIG = {
  TTL: Number(process.env.RATE_LIMIT_TTL) || 60,
  LIMIT: Number(process.env.RATE_LIMIT_MAX) || 10,
} as const;

// Constants untuk file upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: process.env.ALLOWED_FILE_TYPES
    ? process.env.ALLOWED_FILE_TYPES.split(',')
    : ['image/jpeg', 'image/png', 'image/gif'],
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
} as const;

export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: DATABASE_CONFIG.SYNCHRONIZE,
  logger: new TypeOrmCustomLogger(),
  ssl: DATABASE_CONFIG.SSL ? { rejectUnauthorized: false } : false,
  extra: {
    max: DATABASE_CONFIG.MAX_CONNECTIONS,
    connectionTimeoutMillis: DATABASE_CONFIG.CONNECTION_TIMEOUT,
  },
});

// Data source for migration Configuration
export const MIGRATION_CONFIG = {
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migration/*{.ts,.js}'],
  migrationsTableName: 'migration_table',
};

// Export semua config dalam satu object (opsional)
export const CONFIG = {
  APP: APP_CONFIG,
  DATABASE: DATABASE_CONFIG,
  JWT: JWT_CONFIG,
  CORS: CORS_CONFIG,
  RATE_LIMIT: RATE_LIMIT_CONFIG,
  UPLOAD: UPLOAD_CONFIG,
  MIGRATION: MIGRATION_CONFIG,
} as const;

// Types untuk type safety
export type AppConfig = typeof APP_CONFIG;
export type DatabaseConfig = typeof DATABASE_CONFIG;
export type JwtConfig = typeof JWT_CONFIG;

export type CorsConfig = typeof CORS_CONFIG;
export type RateLimitConfig = typeof RATE_LIMIT_CONFIG;
export type UploadConfig = typeof UPLOAD_CONFIG;
