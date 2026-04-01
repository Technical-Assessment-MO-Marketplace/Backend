import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UserRepository extends Repository<User> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    emailExists(email: string): Promise<boolean>;
    createUser(name: string, email: string, hashedPassword: string, roleId: number): Promise<User>;
}
