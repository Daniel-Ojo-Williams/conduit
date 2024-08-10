import { ConfigService } from '@nestjs/config';
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
      entities: [__dirname + '/../**/*.entity.ts'],
      synchronize: false,
    };
  }
}
