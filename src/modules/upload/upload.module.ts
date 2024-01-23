import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// Controller
import { UploadController } from './upload.controller';

// Services
import { PostsService } from '../posts/posts.service';
import { TagsService } from '../tags/tags.service';

// Entity
import { Posts } from '../posts/entities/posts.entity';
import { Tags } from '../tags/entities/tags.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags])],
  controllers: [UploadController],
  providers: [PostsService, TagsService],
})
export class UploadModule {}
