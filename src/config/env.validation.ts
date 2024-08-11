import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

class EnvVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_TYPE: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;
}

export function validateEnv(env: Record<string, unknown>) {
  const validatedEnv = plainToInstance(EnvVariables, env, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedEnv;
}
