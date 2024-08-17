import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseError } from 'pg-protocol';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class HandleDbError implements ExceptionFilter {
  constructor(private handlerNAme: string) {}
  catch(exception: DatabaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();
    const code = exception.code;

    switch (code) {
      case '23505':
        if (this.handlerNAme === 'favoriteArticle')
          resp.sendStatus(HttpStatus.NO_CONTENT);

        if (this.handlerNAme === 'register')
          resp.status(HttpStatus.CONFLICT).json({
            message: 'Email already exists',
            statusCode: HttpStatus.CONFLICT,
          });
        break;
      case '23503':
        if (this.handlerNAme === 'favoriteArticle')
          resp.status(HttpStatus.NOT_FOUND).json({
            message: 'Article not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
    }
  }
}
