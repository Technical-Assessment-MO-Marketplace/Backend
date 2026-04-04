import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import {
  PasswordService,
  TokenService,
  UserHelperService,
  ResponseHandlerService,
} from '../../../common/services';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly USER_ROLE_ID = 2;
  private readonly ADMIN_ROLE_ID = 1;

  constructor(
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private userHelperService: UserHelperService,
    private responseHandlerService: ResponseHandlerService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      this.logger.log(
        `Attempting to register user with email: ${registerDto.email}`,
      );

      const { name, email, password } = registerDto;

      // Validate user email doesn't exist
      await this.userHelperService.validateEmailUniqueness(email);

      // Hash password securely
      const hashedPassword = await this.passwordService.hashPassword(password);

      // Create and save new user
      const user = await this.userHelperService.createNewUser(
        name,
        email,
        hashedPassword,
        this.USER_ROLE_ID,
      );

      // Generate JWT token
      const token = await this.tokenService.generateToken(user);

      // Return response with token
      this.logger.log(`User registered successfully: ${email}`);
      return this.responseHandlerService.formatUserResponse(
        token,
        user,
        'user',
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Registration failed for email ${registerDto.email}: ${message}`,
      );
      throw this.responseHandlerService.handleAuthError(error);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      this.logger.log(`Attempting login for email: ${loginDto.email}`);

      const { email, password } = loginDto;

      // Find user by email with role information
      const user = await this.userHelperService.findUserByEmailWithRole(email);
      if (!user) {
        this.logger.warn(`Login failed: User not found for email ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password matches
      if (!user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }
      await this.passwordService.verifyPassword(password, user.password);

      // Generate JWT token
      const token = await this.tokenService.generateToken(user);

      // Return response with token
      this.logger.log(`User logged in successfully: ${email}`);
      return this.responseHandlerService.formatUserResponse(
        token,
        user,
        user.role?.name || 'user',
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Login failed for email ${loginDto.email}: ${message}`);
      throw this.responseHandlerService.handleAuthError(error);
    }
  }

  async createAdmin(
    adminEmail: string,
    password: string,
    currentUserId: number,
  ) {
    try {
      this.logger.log(
        `Attempting to create admin: ${adminEmail} by user ${currentUserId}`,
      );

      // Verify current user is admin
      await this.userHelperService.verifyUserIsAdmin(currentUserId);

      // Validate new admin email doesn't exist
      await this.userHelperService.validateEmailUniqueness(adminEmail);

      // Hash password securely
      const hashedPassword = await this.passwordService.hashPassword(password);

      // Create and save new admin
      const newAdmin = await this.userHelperService.createNewUser(
        adminEmail,
        adminEmail,
        hashedPassword,
        this.ADMIN_ROLE_ID,
      );

      // Return response
      this.logger.log(`Admin created successfully: ${adminEmail}`);
      return this.responseHandlerService.formatAdminCreationResponse(newAdmin);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create admin ${adminEmail}: ${message}`);
      throw this.responseHandlerService.handleAuthError(error);
    }
  }

  validateToken(payload: any) {
    return this.tokenService.validateTokenPayload(payload);
  }
}
