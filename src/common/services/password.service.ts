import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);
  private readonly BCRYPT_SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(
        password,
        this.BCRYPT_SALT_ROUNDS,
      );
      return hashedPassword;
    } catch (error) {
      this.logger.error(
        `Password hashing failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new InternalServerErrorException('Failed to hash password');
    }
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    try {
      const isPasswordValid = await bcrypt.compare(
        plainPassword,
        hashedPassword,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Password is incorrect');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `Password verification failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new InternalServerErrorException('Password verification error');
    }
  }
}
