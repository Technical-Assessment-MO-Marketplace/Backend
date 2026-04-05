import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';

@Injectable()
export class UserHelperService {
  private readonly logger = new Logger(UserHelperService.name);
  private readonly ADMIN_ROLE_ID = 1;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateEmailUniqueness(email: string): Promise<void> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Email uniqueness validation failed: ${message}`);
      throw new InternalServerErrorException('Failed to validate email');
    }
  }

  async verifyUserIsAdmin(userId: number): Promise<User> {
    try {
      const currentUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!currentUser) {
        throw new UnauthorizedException('User not found');
      }

      if (currentUser.role_id !== this.ADMIN_ROLE_ID) {
        throw new UnauthorizedException('Only admins can perform this action');
      }

      return currentUser;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Admin verification failed: ${message}`);
      throw new InternalServerErrorException('Failed to verify admin status');
    }
  }

  async findUserByEmailWithRole(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['role'],
      });
      return user || null;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to find user by email: ${message}`);
      throw new InternalServerErrorException('Database error');
    }
  }

  async createNewUser(
    name: string,
    email: string,
    hashedPassword: string,
    roleId: number,
  ): Promise<User> {
    try {
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        role_id: roleId,
      });

      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create user: ${message}`);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
