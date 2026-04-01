import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { PasswordService, TokenService, UserHelperService, ResponseHandlerService } from '../../../common/services';
export declare class AuthService {
    private passwordService;
    private tokenService;
    private userHelperService;
    private responseHandlerService;
    private readonly logger;
    private readonly USER_ROLE_ID;
    private readonly ADMIN_ROLE_ID;
    constructor(passwordService: PasswordService, tokenService: TokenService, userHelperService: UserHelperService, responseHandlerService: ResponseHandlerService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
    createAdmin(adminEmail: string, password: string, currentUserId: number): Promise<{
        id: number;
        email: string;
        role: string;
        message: string;
    }>;
    validateToken(payload: any): {
        userId: any;
        email: any;
        roleId: any;
    };
}
