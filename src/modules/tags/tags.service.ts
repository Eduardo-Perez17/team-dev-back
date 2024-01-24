import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

// Entity
import { Tags } from './entities/tags.entity';

// Utils
import { ErrorManager } from 'src/commons/utils/error.manager';

// Dtos
import { TagsCreatetDto } from './dto/createTags.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags) private tagsRepository: Repository<Tags>,
  ) {}

  async createTags({ body }: { body: TagsCreatetDto }): Promise<Tags> {
    try {
      // Search tag by id
      const tagFound = await this.tagsRepository.findOneBy({ tag: body.tag });

      if (tagFound) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'This tag exists',
        });
      }

      // Create tag
      const tag = this.tagsRepository.create(body);
      await this.tagsRepository.save(tag);

      return tag;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getAllTags(): Promise<Tags[]> {
    try {
      return this.tagsRepository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getTagById({ id }: { id: number }): Promise<Tags> {
    try {
      const tag: Tags = await this.tagsRepository.findOneBy({ id });

      if (!tag) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'This tag not found',
        });
      }

      return tag;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
