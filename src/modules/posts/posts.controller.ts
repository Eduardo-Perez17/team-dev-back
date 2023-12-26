import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';

// Services
import { PostsService } from './posts.service';

// Dto's
import { CreatePostDto, ResponseCreatePostDto } from './dto/createPost.dto';
import { EditPostDto } from './dto/editPost.dto';

// Entities
import { Image } from './entities/image.entity';
import { Posts } from './entities/posts.entity';

// Commons
import { ROLES } from '../../../src/commons/models';

// Decorators
import { Roles } from '../../../src/auth/decorators/roles.decorator';

// Helpers
import { fileFilter, renameImage } from 'src/commons/helpers';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload image.',
    description: 'this endpoint is for upload an image.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'The fields to be upload image.',
  })
  @ApiResponse({
    status: 201,
    type: () => ResponseCreatePostDto,
    description: 'upload image successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'image exist.',
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: renameImage,
      }),
      fileFilter: fileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.postService.uploadFile({ file });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get image by id.',
    description: 'this endpoint is for get image by id.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'The fields to be get image by id.',
  })
  @ApiResponse({
    status: 404,
    description: 'image not found.',
  })
  @Get('upload/:image')
  getFileById(@Param('image') image: string): Promise<Image> {
    return this.postService.getFileByName({ image });
  }

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
    status: 201,
    description: 'list all post successfully.',
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Get()
  getAllPost(): Promise<Posts[]> {
    return this.postService.getAllPost();
  }

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
    status: 201,
    type: () => Post,
  })
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Get(':id')
  getPostById(@Param() id: number): Promise<Posts> {
    return this.postService.getPostById({ id });
  }

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
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Put(':id')
  updatePost(
    @Param('id') id: number,
    @Body() body: EditPostDto,
  ): Promise<EditPostDto> {
    return this.postService.updatePost({ id, body });
  }

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
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER)
  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost({ id });
  }
}
