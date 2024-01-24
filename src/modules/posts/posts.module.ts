import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { PostsService } from './posts.service';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';

// Controller
import { PostsController } from './posts.controller';

// Entities
import { Posts } from './entities/posts.entity';
import { Tags } from '../tags/entities/tags.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags, User])],
  controllers: [PostsController],
  providers: [PostsService, TagsService, UsersService],
})
export class PostsModule {}
