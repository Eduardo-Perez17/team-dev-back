import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTO'S
import { CreateUserDto } from './dto/create-user.dto';

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

  findByEmail({ email }: { email: string }) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
