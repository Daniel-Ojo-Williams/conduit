import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Expose()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
