import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, UnprocessableEntityException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // automatically remove unknown properties from the object
      forbidNonWhitelisted: true, // throw an error if unknown properties are found in the object
      transform: true, // transform the object to the required type in the DTO
      transformOptions: {
        enableImplicitConversion: true, // automatically convert the object to the required type in the DTO
      },
      exceptionFactory: (validationError) => {
        return new UnprocessableEntityException(
          validationError.map((error) => {
            return {
              field: error.property,
              message: Object.values(error.constraints ?? {}).join(', '),
            };
          }),
        );
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
