import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: (process.env.DB_PORT as unknown as number) || 5432,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['dist/src/**/entities/*.js'],
  migrations: ['dist/src/database/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
