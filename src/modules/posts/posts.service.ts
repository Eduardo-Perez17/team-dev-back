import { Injectable } from '@nestjs/common';

// Entity
import { Posts } from './entities/posts.entity';

// Dto's
import { CreatePostDto } from './dto/createPost.dto';

// Utils
import { ErrorManager } from '../../../src/commons/utils/error.manager';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
  ) {}

  async createPost({ body }: { body: CreatePostDto }): Promise<Posts> {
    try {
      // we generate the url of the post
      const separationOfTitle = body.title;
      const separationOfTitleResult = separationOfTitle
        .split(' ')
        .join('-')
        .toLowerCase();

      body.url = separationOfTitleResult;

      const post: Posts = await this.findByUrl({
        url: separationOfTitleResult,
      });

      if (post) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'The url already exists',
        });
      }

      const newPost: Posts = this.postsRepository.create(body);
      return this.postsRepository.save(newPost);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getAllPost(): Promise<Posts[]> {
    return this.postsRepository.find();
  }

  async findByUrl({ url }: { url: string }) {
    try {
      return this.postsRepository.findOne({ where: { url } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
