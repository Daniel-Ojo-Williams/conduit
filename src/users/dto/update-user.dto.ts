import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  username: string;
}
