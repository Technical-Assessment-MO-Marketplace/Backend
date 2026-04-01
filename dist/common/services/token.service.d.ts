import { JwtService } from '@nestjs/jwt';
import { User } from '../../modules/auth/entities/user.entity';
export declare class TokenService {
    private jwtService;
    private readonly logger;
    private readonly JWT_EXPIRATION;
    constructor(jwtService: JwtService);
    generateToken(user: User): Promise<string>;
    validateTokenPayload(payload: any): {
        userId: any;
        email: any;
        roleId: any;
    };
}
