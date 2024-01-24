// Entities
import { Tags } from 'src/modules/tags/entities/tags.entity';

// Enums
import { TypePost } from '../enums/typePost.enums';

export class IPost {
  title: string;
  content: string;
  url: string;
  published: boolean;
  type: TypePost;
  tags: Tags;
}
