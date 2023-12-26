import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Entity
import { Posts } from './entities/posts.entity';
import { Image } from './entities/image.entity';

// Dto's
import { EditPostDto } from './dto/editPost.dto';
import { CreatePostDto } from './dto/createPost.dto';

// Utils
import { ErrorManager } from '../../../src/commons/utils/error.manager';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
  ) {}

  async uploadFile({ file }: { file: Express.Multer.File }) {
    try {
      await this.getFileByName({
        image: file.originalname,
      });

      const newImage = this.imageRepository.create({
        image: file.originalname,
        createdAt: new Date(),
      });

      return await this.imageRepository.save(newImage);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async createPost({ body }: { body: CreatePostDto }): Promise<Posts> {
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

      // assign image a post
      const image: Image = await this.imageRepository.findOneBy({
        id: body.imageId,
      });

      const assignImagePost: Posts = this.postsRepository.create({
        ...body,
        image,
        createdAt: new Date(),
      });

      return await this.postsRepository.save(assignImagePost);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getAllPost(): Promise<Posts[]> {
    try {
      const posts: Posts[] = await this.postsRepository.find({
        relations: ['image'],
      });

      return posts;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

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

  async getPostById({ id }: { id: number }): Promise<Posts> {
    try {
      const post: Posts = await this.postsRepository.findOneBy({ id });

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

  async getFileByName({ image }: { image: string }): Promise<Image> {
    try {
      const imageFound: Image = await this.imageRepository.findOne({
        where: { image },
      });

      if (imageFound) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'This image already exists',
        });
      }

      return imageFound;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
