import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './security/passport.jwt.strategy';
import { UserAuthorityRepository } from './repository/user-authority.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, UserAuthorityRepository]),
    JwtModule.register({
      secret: '123456',
      signOptions: { expiresIn: '300s' },
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy]
})
export class AuthModule {}
