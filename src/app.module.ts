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


@Module({
  imports: [
    //TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig}),
    AuthModule,
    PassportModule,
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
