import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { PostsService } from './posts.service';

// Controller
import { PostsController } from './posts.controller';

// Entities
import { Posts } from './entities/posts.entity';
import { Tags } from '../tags/entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Tags])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
