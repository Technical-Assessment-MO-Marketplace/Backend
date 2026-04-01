import { DataSource } from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';
export declare class UserHelperService {
    private dataSource;
    private userRepository;
    private readonly logger;
    private readonly ADMIN_ROLE_ID;
    constructor(dataSource: DataSource);
    validateEmailUniqueness(email: string): Promise<void>;
    verifyUserIsAdmin(userId: number): Promise<User>;
    findUserByEmailWithRole(email: string): Promise<User | null>;
    createNewUser(name: string, email: string, hashedPassword: string, roleId: number): Promise<User>;
}
