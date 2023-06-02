import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from 'middleward/logger.middleware';
import { ormConfig } from 'orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

import { User } from './auth/domain/user.entity';
import { UserAuthority } from './auth/domain/user-authority.entity';

import { ConfigModule } from '@nestjs/config';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    //TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig}),
    AuthModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(LoggerMiddleware)
        .forRoutes('cats');
  }
}

