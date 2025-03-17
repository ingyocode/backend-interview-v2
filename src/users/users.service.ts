import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/users/users.entity';
import { Repository } from 'typeorm';
import { pbkdf2Sync, randomBytes } from 'crypto';

export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) {}

  async getUser(email: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({
      where: {
        email
      }
    });
  }

  async createUser(email: string, password: string): Promise<UsersEntity> {
    const passwordInfo = this.hashPassword(password);
    const user = await this.usersRepository.save({
      email,
      password: passwordInfo.password,
      salt: passwordInfo.salt
    });

    return user;
  }

  hashPassword(
    password: string,
    passwordSalt?: string,
  ): { password: string; salt: string } {
    const salt = passwordSalt || randomBytes(64).toString('base64'),
      encryptPassword =
        password && pbkdf2Sync(password, salt, 131072, 64, 'sha512').toString('base64');
    return {
      password: encryptPassword,
      salt,
    };
  }
}