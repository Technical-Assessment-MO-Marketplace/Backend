import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  PasswordService,
  TokenService,
  UserHelperService,
  ResponseHandlerService,
} from './services';

@Module({
  imports: [
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
