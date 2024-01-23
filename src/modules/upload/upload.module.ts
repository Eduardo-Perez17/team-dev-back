import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// Controller
import { UploadController } from './upload.controller';

// Services
import { PostsService } from '../posts/posts.service';

// Entity
import { Posts } from '../posts/entities/posts.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Posts])],
  controllers: [UploadController],
  providers: [PostsService],
})
export class UploadModule {}
