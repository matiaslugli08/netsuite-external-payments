import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config()

async function bootstrap() {

  console.log(process.env) // remove this after you've confirmed it is working


  
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
