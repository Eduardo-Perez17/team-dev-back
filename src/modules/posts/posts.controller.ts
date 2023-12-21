import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

// Services
import { PostsService } from './posts.service';

// Dto's
import { CreatePostDto, ResponseCreatePostDto } from './dto/createPost.dto';

// Entities
import { Posts } from './entities/posts.entity';

// Commons
import { ROLES } from '../../../src/commons/models';

// Decorators
import { Roles } from '../../../src/auth/decorators/roles.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create post.',
    description: 'this endpoint is for create a post.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'The fields to be created.',
  })
  @ApiResponse({
    status: 201,
    type: () => ResponseCreatePostDto,
    description: 'create post successfully.',
  })
  @ApiResponse({
    status: 409,
    type: () => 'CONFLICT',
    description: 'The url already exists.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Post()
  createPost(@Body() body: CreatePostDto): Promise<Posts> {
    return this.postService.createPost({ body });
  }

  @Get()
  getAllPost(): Promise<Posts[]> {
    return this.postService.getAllPost();
  }
}
