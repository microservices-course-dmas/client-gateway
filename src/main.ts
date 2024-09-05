import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CustomRpcExceptionFilter } from './common/exceptions/rpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Main-Gateway')

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters( new CustomRpcExceptionFilter);
  
  await app.listen(envs.port);
  
  logger.log(`Server on port ->${envs.port}`)
}
bootstrap();
