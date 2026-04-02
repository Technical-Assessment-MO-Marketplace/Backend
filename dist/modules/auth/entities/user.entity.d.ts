import { Role } from './role.entity';
export declare class User {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    role_id?: number;
    role?: Role;
    created_at?: Date;
}
