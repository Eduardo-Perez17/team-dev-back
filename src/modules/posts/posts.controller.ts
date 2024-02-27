import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Services
import { PostsService } from './posts.service';

// Dto's
import { CreatePostDto, ResponseCreatePostDto } from './dto/createPost.dto';
import { EditPostDto } from './dto/editPost.dto';

// Entities
import { Posts } from './entities/posts.entity';

// Commons
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';
import { ROLES } from 'src/commons/models';
import { JwtPayload } from 'src/commons/types';

// Decorators
import { Roles } from 'src/auth/decorators/roles.decorator';

// Auth
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ResponseInterceptor)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  // Create Post
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
    type: CreatePostDto,
    description: 'create post successfully.',
  })
  @ApiResponse({
    status: 409,
    type: () => 'CONFLICT',
    description: 'The url already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Post()
  createPost(
    @Body() body: CreatePostDto,
    @Req() request: JwtPayload,
  ): Promise<Posts> {
    return this.postService.createPost({ body, user: request.user });
  }

  // List all post
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all post.',
    description: 'this endpoint is for list all post.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'The fields to be list all post.',
  })
  @ApiResponse({
    status: 200,
    description: 'list all post successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Get()
  getAllPost(
    @Req() req: JwtPayload,
    @Query('type') type: string,
    @Query('search') search: string,
    @Query('filter') filter: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(7), ParseIntPipe) limit: number = 7,
  ): Promise<{ limit: number; offset: number; total: number; data: Posts[] }> {
    return this.postService.getAllPost({ limit, page, filter, search, type, user: req.user });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Get('analytics')
  postAnalitycs() {
    return this.postService.postAnalitycs()
  }

  // Get post by id
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get post by id.',
    description: 'this endpoint is for get post by id.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'The fields to be get post by id.',
  })
  @ApiResponse({
    status: 200,
    type: () => Post,
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number): Promise<Posts> {
    return this.postService.getPostById({ id });
  }

  // Get Post by url
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get post by url.',
    description: 'this endpoint is for get post by url.',
  })
  @ApiBody({
    type: ResponseCreatePostDto,
    description: 'The fields to be get post by url.',
  })
  @ApiResponse({
    status: 200,
    type: () => Post,
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Get('url/:url')
  getPostByUrl(@Param('url') url: string): Promise<Posts> {
    return this.postService.getPostByUrl({ url });
  }

  // Update post by id
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update post by id.',
    description: 'this endpoint is for update post by id.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'The fields to be update post by id.',
  })
  @ApiResponse({
    status: 200,
    type: () => Post,
  })
  @ApiResponse({
    status: 404,
    description: 'this post not exist.',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Patch(':id')
  updatePost(
    @Param('id') id: number,
    @Body() body: EditPostDto,
    @Req() req: JwtPayload
  ): Promise<EditPostDto> {
    return this.postService.updatePost({ id, body, user: req.user });
  }

  // Delete post by
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'delete post by id.',
    description: 'this endpoint is for delete post by id.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'The fields to be delete post by id.',
  })
  @ApiResponse({
    status: 200,
    type: () => Post,
  })
  @ApiResponse({
    status: 404,
    description: 'this post not exist.',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost({ id });
  }

  // User saved post
  // TODO : QUITAR
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'saved post by id.',
    description: 'this endpoint is for saved post by id for user.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'The fields to be saved post by id.',
  })
  @ApiResponse({
    status: 200,
    type: () => Post,
  })
  @ApiResponse({
    status: 404,
    description: 'this post not exist.',
  })
  @ApiResponse({
    status: 409,
    description: 'this post it was not saved correctly.',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Get('saved/:id')
  userSavedPost(@Param('id') id: number, @Req() req: JwtPayload): Promise<Posts> {
    return this.postService.userSavedPost({ id, req: req.user })
  }
}
