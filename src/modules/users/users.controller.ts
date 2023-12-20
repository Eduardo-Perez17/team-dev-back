import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Services
import { UsersService } from './users.service';

// DTO'S
import { CreateUserDto, ResponseCreateUserDto } from './dto/create-user.dto';

// Guards
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

// Decorators
import { Roles } from '../../auth/decorators/roles.decorator';

// Commons
import { ROLES } from '../../commons/models';
import { JwtPayload } from 'src/commons/types';

// Interceptors
import { ResponseInterceptor } from '../../commons/interceptors/response.interceptor';

// Entities
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create user.',
    description: 'this endpoint is for create a user.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'The fields to be created.',
  })
  @ApiResponse({
    status: 201,
    type: () => ResponseCreateUserDto,
    description: 'create user successfully.',
  })
  @ApiResponse({
    status: 409,
    type: () => 'CONFLICT',
    description: 'The email already exists.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Post()
  createUser(
    @Body() body: CreateUserDto,
    @Req() req: JwtPayload,
  ): Promise<User> {
    return this.usersService.createUser({ body, req });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all users.',
    description: 'this endpoint is for list all users.',
  })
  @ApiBody({
    type: User,
    description: 'Returns the list of users in the api.',
  })
  @ApiResponse({
    status: 200,
    type: () => User,
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get()
  getAllUsers(@Req() req: JwtPayload): Promise<User[]> {
    return this.usersService.getAllUsers({ req });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by id.',
    description: 'this endpoint is for return user by id.',
  })
  @ApiBody({
    type: User,
    description: 'Returns one user by id.',
  })
  @ApiResponse({
    status: 200,
    type: () => User,
  })
  @ApiResponse({
    status: 404,
    type: () => 'This user not found.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get(':id')
  getUserById(@Param('id') id: number, @Req() req: JwtPayload): Promise<User> {
    return this.usersService.getUserById({ id, req });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit user by id.',
    description: 'this endpoint is for edit user by id.',
  })
  @ApiBody({
    type: User,
    description: 'Edit one user by id.',
  })
  @ApiResponse({
    status: 200,
    type: () => User,
  })
  @ApiResponse({
    status: 404,
    type: () => 'This user not found.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Put(':id')
  editUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
    @Req() req: JwtPayload,
  ): Promise<UpdateUserDto> {
    return this.usersService.editUser({ id, body, req });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user by id.',
    description: 'this endpoint is for delete user by id.',
  })
  @ApiBody({
    type: User,
    description: 'delete one user by id.',
  })
  @ApiResponse({
    status: 200,
    type: () => User,
  })
  @ApiResponse({
    status: 404,
    type: () => 'This user not found.',
  })
  @ApiResponse({
    status: 403,
    type: () => 'You are not allowed to delete your own profile.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: number, @Req() req: JwtPayload): Promise<User> {
    return this.usersService.deleteUser({ id, req });
  }
}
