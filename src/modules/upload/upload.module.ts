import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// Controller
import { UploadController } from './upload.controller';

// Services
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { TagsService } from '../tags/tags.service';

// Entity
import { Posts } from '../posts/entities/posts.entity';
import { Tags } from '../tags/entities/tags.entity';
import { User } from '../users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags, User])],
  controllers: [UploadController],
  providers: [PostsService, TagsService, UsersService],
})
export class UploadModule {}
