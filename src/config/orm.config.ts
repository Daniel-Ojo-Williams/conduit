import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export default class TypeOrmConfig {
  static getConfigOptions(config: ConfigService): DataSourceOptions {
    return {
      type: config.get<'postgres'>('DB_TYPE'),
      port: config.get<number>('DB_PORT'),
      host: config.get('DB_HOST'),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: false,
    };
  }
}

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (config: ConfigService): Promise<DataSourceOptions> =>
    TypeOrmConfig.getConfigOptions(config),
  inject: [ConfigService],
};
