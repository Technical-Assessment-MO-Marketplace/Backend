import { BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../modules/auth/entities/user.entity';
export declare class ResponseHandlerService {
    private readonly logger;
    formatUserResponse(token: string, user: User, role: string): {
        access_token: string;
        user: {
            id: number | undefined;
            name: string | undefined;
            email: string | undefined;
            role: string;
        };
    };
    formatAdminCreationResponse(newAdmin: User): {
        id: number | undefined;
        email: string | undefined;
        role: string;
        message: string;
    };
    handleAuthError(error: any): InternalServerErrorException | UnauthorizedException | BadRequestException;
}
