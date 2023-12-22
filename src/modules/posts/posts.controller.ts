import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';

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

// Helpers
import { fileFilter, renameImage } from 'src/commons/helpers';

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
    console.log(file);
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
