import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

// console.log(process.env.DEV_DB);

const commonConfig = {
  type: 'postgres',
  synchronize: true,
};

const specific = {};
switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(specific, {
      host: 'localhost',
      port: 5432,

      synchronize: true,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DEV_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    });
    break;
  case 'test':
    Object.assign(specific, {
      host: 'localhost',
      port: 5432,

      synchronize: true,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.TEST_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    });
    break;
  case 'production':
    Object.assign(specific, {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl:
        process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
    break;

  default:
    throw new Error(`Unknown environment: ${process.env.NODE_ENV}`);
}

export const AppDataSource = new DataSource({
  ...commonConfig,
  ...specific,
});
