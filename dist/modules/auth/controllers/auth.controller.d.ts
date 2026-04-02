import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number | undefined;
            name: string | undefined;
            email: string | undefined;
            role: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number | undefined;
            name: string | undefined;
            email: string | undefined;
            role: string;
        };
    }>;
    createAdmin(createAdminDto: CreateAdminDto, req: any): Promise<{
        id: number | undefined;
        email: string | undefined;
        role: string;
        message: string;
    }>;
    getProfile(req: any): Promise<{
        user: any;
        message: string;
    }>;
}
