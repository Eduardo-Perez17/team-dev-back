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
      const tags = await this.tagsRepository.find();
      return this.shuffleArray(tags);
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

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
