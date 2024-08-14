import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ListArticleQueryDto {
  @IsOptional()
  @IsString()
  tag: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset: number;
}
