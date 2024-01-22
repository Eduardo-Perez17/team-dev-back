import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// Controller
import { UploadController } from './upload.controller';

// Services
import { PostsService } from '../posts/posts.service';

// Entity
import { Posts } from '../posts/entities/posts.entity';
import { Image } from '../posts/entities/image.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Posts, Image])],
  controllers: [UploadController],
  providers: [PostsService],
})
export class UploadModule {}
