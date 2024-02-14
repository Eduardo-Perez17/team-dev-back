import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTO'S
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Entity
import { User } from './entities/user.entity';

// Commons
import { REJEXT_PASSWORD } from '../../commons/constants/rejext-password.constants';
import { returnErrorManager } from '../../commons/utils/returnError.manager';
import { ErrorManager } from '../../commons/utils/error.manager';
import { JwtPayload } from '../../commons/types';
import { ROLES } from '../../commons/models';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  // Create User
  async createUser({ body }: { body: CreateUserDto }): Promise<User> {
    try {
      // Serach user by email
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

  // Get All Users
  async getAllUsers({ req }: { req: JwtPayload }): Promise<User[]> {
    try {
      // If role is ADMIN list all role USER
      if (req.role === ROLES.ADMIN) {
        return this.usersRepository.find({ where: { role: ROLES.USER } });
      }

      // Otherwise, return to all users
      return this.usersRepository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Get user by id
  async getUserById({
    id,
    req,
  }: {
    id: number;
    req: JwtPayload;
  }): Promise<User> {
    try {
      // If role is ADMIN i want to return the users that are only USER
      if (req.role === ROLES.ADMIN) {
        const user: User = await this.usersRepository.findOne({
          where: { id, role: ROLES.USER },
        });

        // we return an error if the condition does not pass
        returnErrorManager({ user });
        return user;
      }

      // return the users with role USER
      const user: User = await this.usersRepository.findOneBy({ id });

      // we return an error if the condition does not pass
      returnErrorManager({ user });
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Edit user by id
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
      // Validation email does not exists
      if (body.email) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'The email is not editable',
        });
      }

      // IF the email not exist, search the user by id
      const user: User = await this.getUserById({ id, req });

      // We combine the new information that comes to us with the POST method with the user's old information
      const updateUser: UpdateUserDto = Object.assign(user, body);
      await this.usersRepository.update(id, updateUser);
      return updateUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Delete user by id
  async deleteUser({
    id,
    req,
  }: {
    id: number;
    req: JwtPayload;
  }): Promise<User> {
    try {
      // Validation for not delete my own user
      if (Number(id) === req.sub) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'You are not allowed to delete your own profile',
        });
      }

      // If not my own user, search user by id
      const user: User = await this.getUserById({ id, req });

      // If all conditions pass, a softdelete of the user is done.
      await this.usersRepository.softDelete(id);
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Search user by email
  async findByEmail({ email }: { email: string }) {
    try {
      // search user by email
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
