import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {
  PasswordService,
  TokenService,
  UserHelperService,
  ResponseHandlerService,
} from './services';
import { User } from '../modules/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    PasswordService,
    TokenService,
    UserHelperService,
    ResponseHandlerService,
  ],
  exports: [
    PasswordService,
    TokenService,
    UserHelperService,
    ResponseHandlerService,
  ],
})
export class CommonModule {}
