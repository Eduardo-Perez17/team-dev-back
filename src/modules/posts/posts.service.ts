import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Entity
import { Posts } from './entities/posts.entity';
import { Image } from './entities/image.entity';

// Dto's
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
      const separationOfTitle = body.title;
      const separationOfTitleResult = separationOfTitle
        .split(' ')
        .join('-')
        .toLowerCase();

      body.url = separationOfTitleResult;

      await this.findByUrl({
        url: separationOfTitleResult,
      });

      // assign image a post
      const image = await this.imageRepository.findOneBy({ id: body.imageId });

      const assignImagePost = this.postsRepository.create({
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
    return this.postsRepository.find();
  }

  async findByUrl({ url }: { url: string }) {
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

      return;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getFileByName({ image }: { image: string }) {
    try {
      const imageFound = await this.imageRepository.findOne({
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
