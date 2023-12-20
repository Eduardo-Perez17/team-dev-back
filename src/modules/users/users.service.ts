import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTO'S
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Entity
import { User } from './entities/user.entity';

// Commons
import { ErrorManager } from '../../commons/utils/error.manager';
import { REJEXT_PASSWORD } from 'src/commons/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser({ body }: { body: CreateUserDto }): Promise<User> {
    try {
      const user: User = await this.findByEmail({ email: body.email });

      if (user) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'The email already exists',
        });
      }

      // The password has to follow a pattern to be secure
      if (!REJEXT_PASSWORD.test(body.password)) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: `The password must have the following requirements: minimum 8 characters, 1 capital letter, 1 minuscule, 1 special character`,
        });
      }

      // the role always comes in small letters
      body.role.toLowerCase();

      const newUser: User = this.usersRepository.create(body);
      return this.usersRepository.save(newUser);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getUserById({ id }: { id: number }): Promise<User> {
    try {
      const user: User = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'This user not found',
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async editUser({ id, body }: { id: number; body: UpdateUserDto }) {
    try {
      if (body.email) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'The email is not editable',
        });
      }

      const user: User = await this.getUserById({ id });

      const updateUser: UpdateUserDto = Object.assign(user, body);
      await this.usersRepository.update(id, updateUser);
      return updateUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteUser({ id }: { id: number }): Promise<User> {
    const user: User = await this.getUserById({ id });

    await this.usersRepository.delete(id);
    return user;
  }

  findByEmail({ email }: { email: string }) {
    try {
      return this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
