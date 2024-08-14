import { IsOptional, IsString } from 'class-validator';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';

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

export class NoEmptyBoyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;

    if (type === 'body') {
      if (Object.keys(value).length === 0)
        throw new HttpException(
          { message: 'Empty request sent' },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }

    return value;
  }
}
