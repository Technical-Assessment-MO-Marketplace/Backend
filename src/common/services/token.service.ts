import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../modules/auth/entities/user.entity';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly JWT_EXPIRATION = '24h';

  constructor(private jwtService: JwtService) {}

  async generateToken(user: User): Promise<string> {
    try {
      const token = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          role_id: user.role_id,
        },
        { expiresIn: this.JWT_EXPIRATION },
      );
      return token;
    } catch (error) {
      this.logger.error(`Token generation failed: ${error.message}`);
      throw new InternalServerErrorException('Failed to generate token');
    }
  }

  validateTokenPayload(payload: any) {
    try {
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return {
        userId: payload.sub,
        email: payload.email,
        roleId: payload.role_id,
      };
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
