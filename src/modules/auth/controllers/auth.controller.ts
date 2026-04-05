import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Create a new user account with email and password. Password must be at least 6 characters.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input - email already exists, password too short, or invalid email format',
    schema: {
      example: {
        statusCode: 400,
        message:
          'Email already exists or password must be at least 6 characters',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticate user with email and password. Returns JWT token on success.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials - email not found or password incorrect',
    schema: {
      example: {
        statusCode: 401,
        message: 'Email address not found or Password is incorrect',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin/create')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create admin user (Admin only)',
    description:
      'Create a new admin account. Only existing admins can create new admins.',
  })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
    schema: {
      example: {
        id: 2,
        email: 'admin@example.com',
        role: 'admin',
        message: 'Admin created successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - user is not authenticated or not an admin',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    return this.authService.createAdmin(
      createAdminDto.email,
      createAdminDto.password,
      req.user.userId,
    );
  }

  @Post('profile')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve the current authenticated user profile information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      example: {
        user: {
          email: 'john@example.com',
        },
        message: 'Profile retrieved successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token missing or invalid',
  })
  async getProfile(@Request() req) {
    return {
      user: {
        email: req.user.email,
      },
      message: 'Profile retrieved successfully',
    };
  }
}
