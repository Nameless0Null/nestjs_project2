import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


import { ConfigService } from "@nestjs/config";

import * as express from 'express';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    );
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('jade');
  
  app.use('/', express.static('./src/'));

  const config = new DocumentBuilder()
  .setTitle('API문서명')
  .setDescription('API문서 설명')
  .setVersion('1.0') // API 버전
  .addCookieAuth('connect.sid') // 쿠키 옵션
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app,document);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('server.port');
  await app.listen(port);
  console.log(`Application listening on port ${port}`);
}
bootstrap();


