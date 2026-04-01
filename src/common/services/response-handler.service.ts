import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '../../modules/auth/entities/user.entity';

@Injectable()
export class ResponseHandlerService {
  private readonly logger = new Logger(ResponseHandlerService.name);

  formatUserResponse(token: string, user: User, role: string) {
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    };
  }

  formatAdminCreationResponse(newAdmin: User) {
    return {
      id: newAdmin.id,
      email: newAdmin.email,
      role: 'admin',
      message: 'Admin created successfully',
    };
  }

  handleAuthError(error: any) {
    // If already a NestJS exception, re-throw it
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException ||
      error instanceof InternalServerErrorException
    ) {
      return error;
    }

    // Log unexpected errors for debugging
    this.logger.error(`Unexpected auth error: ${error.message}`);

    // Return generic error for security (don't expose internal details)
    return new InternalServerErrorException(
      'An error occurred during authentication',
    );
  }
}
