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
import { REJEXT_PASSWORD } from '../../commons/constants';
import { JwtPayload } from '../../commons/types';
import { ROLES } from 'src/commons/models';
import { returnErrorManager } from 'src/commons/utils/returnError.manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser({
    body,
    req,
  }: {
    body: CreateUserDto;
    req: JwtPayload;
  }): Promise<User> {
    try {
      if (req.user.role === ROLES.ADMIN) {
        if (body.role === ROLES.ADMIN || body.role === ROLES.SUPERADMIN) {
          throw new ErrorManager({
            type: 'FORBIDDEN',
            message:
              'As an admin you do not have permissions to create users with an administrator or super administrator role.',
          });
        }
      }

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

  async getAllUsers({ req }: { req: JwtPayload }): Promise<User[]> {
    try {
      if (req.user.role === ROLES.ADMIN) {
        return this.usersRepository.find({ where: { role: ROLES.USER } });
      }

      return this.usersRepository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getUserById({
    id,
    req,
  }: {
    id: number;
    req: JwtPayload;
  }): Promise<User> {
    try {
      if (req.user.role === ROLES.ADMIN) {
        const user: User = await this.usersRepository.findOne({
          where: { id, role: ROLES.USER },
        });

        // we return an error if the condition does not pass
        returnErrorManager({ user });
        return user;
      }

      const user: User = await this.usersRepository.findOneBy({ id });

      // we return an error if the condition does not pass
      returnErrorManager({ user });
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async editUser({
    id,
    body,
    req,
  }: {
    id: number;
    body: UpdateUserDto;
    req: JwtPayload;
  }) {
    try {
      if (body.email) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'The email is not editable',
        });
      }

      const user: User = await this.getUserById({ id, req });

      const updateUser: UpdateUserDto = Object.assign(user, body);
      await this.usersRepository.update(id, updateUser);
      return updateUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteUser({
    id,
    req,
  }: {
    id: number;
    req: JwtPayload;
  }): Promise<User> {
    try {
      if (Number(id) === req.user.sub) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'You are not allowed to delete your own profile',
        });
      }

      const user: User = await this.getUserById({ id, req });

      await this.usersRepository.delete(id);
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  findByEmail({ email }: { email: string }) {
    try {
      return this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
