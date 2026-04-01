export declare class PasswordService {
    private readonly logger;
    private readonly BCRYPT_SALT_ROUNDS;
    hashPassword(password: string): Promise<string>;
    verifyPassword(plainPassword: string, hashedPassword: string): Promise<void>;
}
