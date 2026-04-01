import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
    roleId: number,
  ): Promise<User> {
    const user = this.create({
      name,
      email,
      password: hashedPassword,
      role_id: roleId,
    });
    return this.save(user);
  }
}
