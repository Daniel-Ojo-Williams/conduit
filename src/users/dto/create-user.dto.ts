import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Exclude()
  password: string;
}

export class ResponseDto extends CreateUserDto {
  @IsString()
  @Expose()
  username: string;

  @IsString()
  @Expose()
  bio: string;

  @IsString()
  @Expose()
  image: string;
}
