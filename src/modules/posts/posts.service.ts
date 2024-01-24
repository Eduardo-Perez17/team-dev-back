import { Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Entity
import { Tags } from '../tags/entities/tags.entity';
import { Posts } from './entities/posts.entity';

// Dto's
import { EditPostDto } from './dto/editPost.dto';
import { CreatePostDto } from './dto/createPost.dto';

// Utils
import { ErrorManager } from 'src/commons/utils/error.manager';
import { JwtPayload } from 'src/commons/types';

// Services
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    private readonly usersService: UsersService,
    private readonly tagsServices: TagsService,
  ) {}

  // Create post
  async createPost({
    body,
    user,
  }: {
    body: CreatePostDto;
    user: JwtPayload;
  }): Promise<Posts> {
    try {
      // we generate the url of the post
      const separationOfTitle: string = body.title;
      const separationOfTitleResult: string = separationOfTitle
        .split(' ')
        .join('-')
        .toLowerCase();

      body.url = separationOfTitleResult;

      await this.findByUrl({
        url: separationOfTitleResult,
      });

      // Search y save user post
      const userFound: User = await this.usersService.getUserById({
        id: user.sub,
        req: user,
      });

      // Search y save tag post
      const tagFound: Tags = await this.tagsServices.getTagById({
        id: body.tagsId,
      });

      const newPost: Posts = await this.postsRepository.create({
        ...body,
        user: userFound,
        tags: tagFound,
      });

      return await this.postsRepository.save(newPost);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Get all post
  async getAllPost({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }): Promise<{ limit: number; offset: number; total: number; data: Posts[] }> {
    try {
      const offset: number = (page - 1) * limit;

      const queryBuilder: SelectQueryBuilder<Posts> = this.postsRepository
        .createQueryBuilder('posts')
        .innerJoinAndSelect('posts.tags', 'tags')
        .innerJoinAndSelect('posts.user', 'user')
        .orderBy('posts.id', 'DESC');

      const [posts, total]: [Posts[], number] = await queryBuilder
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      return { limit: limit, offset: offset, total: total, data: posts };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Find by url
  async findByUrl({ url }: { url: string }): Promise<Posts> {
    try {
      const post: Posts = await this.postsRepository.findOne({
        where: { url },
      });

      if (post) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'The url already exists',
        });
      }

      return post;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Get post by id
  async getPostById({ id }: { id: number }): Promise<Posts> {
    try {
      const post: Posts = await this.postsRepository.findOne({
        where: { id: id },
        relations: ['user', 'tags'],
      });

      if (!post) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'This post not found',
        });
      }

      return post;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Get post by url
  async getPostByUrl({ url }: { url: string }): Promise<Posts> {
    try {
      const post: Posts = await this.postsRepository.findOne({
        where: { url: url },
        relations: ['user', 'tags'],
      });

      if (!post) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'This post not found',
        });
      }

      return post;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Update post by id
  async updatePost({
    id,
    body,
  }: {
    id: number;
    body: EditPostDto;
  }): Promise<Posts> {
    try {
      const post: Posts = await this.getPostById({ id });

      const updatePost: Posts = Object.assign(post, body);
      await this.postsRepository.update(id, updatePost);
      return updatePost;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // Delete post by id
  async deletePost({ id }: { id: number }): Promise<Posts> {
    try {
      const post: Posts = await this.getPostById({ id });

      if (post.published) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'This post is public',
        });
      }

      await this.postsRepository.delete(id);
      return post;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
