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
import { UpdateUserDto } from './dto/update-user.dto';

// Guards
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

// Decorators
import { Roles } from 'src/auth/decorators/roles.decorator';

// Commons
import { JwtPayload } from 'src/commons/types';
import { ROLES } from 'src/commons/models';

// Interceptors
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';

// Entities
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create user
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
  @Roles(ROLES.SUPERADMIN)
  @Post()
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.createUser({ body });
  }

  // Get All Users
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
  @Roles(ROLES.SUPERADMIN)
  @Get()
  getAllUsers(@Req() req: JwtPayload): Promise<User[]> {
    return this.usersService.getAllUsers({ req });
  }

  // Get user by id
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
  @Roles(ROLES.SUPERADMIN)
  @Get(':id')
  getUserById(@Param('id') id: number, @Req() req: JwtPayload): Promise<User> {
    return this.usersService.getUserById({ id, req });
  }

  // Edit user by id
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
  @Roles(ROLES.SUPERADMIN)
  @Put(':id')
  editUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
    @Req() req: JwtPayload,
  ): Promise<UpdateUserDto> {
    return this.usersService.editUser({ id, body, req });
  }

  // Delete user by id
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
  @Roles(ROLES.SUPERADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: number, @Req() req: JwtPayload): Promise<User> {
    return this.usersService.deleteUser({ id, req });
  }
}
