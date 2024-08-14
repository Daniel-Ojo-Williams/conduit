import {
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class ValidateEmptyBody implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;

    if (type === 'body') {
      if (Object.keys(value).length === 0 || !value)
        throw new HttpException(
          { message: 'Empty request sent' },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }

    return value;
  }
}
