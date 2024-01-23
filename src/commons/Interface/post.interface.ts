import { Tags } from 'src/modules/tags/entities/tags.entity';

export class IPost {
  title: string;
  content: string;
  url: string;
  published: boolean;
  tags: Tags;
}
