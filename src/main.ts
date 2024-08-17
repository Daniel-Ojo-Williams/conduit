import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidateEmptyBody } from './pipes/ValidateEmptyBody.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api', {
    exclude: ['auth(.*)'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const formattedErrors = Object.values(errors[0].constraints).join(', ');
        return new UnprocessableEntityException(formattedErrors);
      },
    }),
    new ValidateEmptyBody(),
  );
  await app.listen(4000);
}
bootstrap();
