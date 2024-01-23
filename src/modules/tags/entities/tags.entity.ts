import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// Entities
import { Posts } from '../../posts/entities/posts.entity';

// Commons
import { BaseEntity } from '../../../commons/baseEntity';

// Interfaces
import { ITags } from 'src/commons/Interface/tags.interface';

@Entity({ name: 'tags' })
export class Tags extends BaseEntity implements ITags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, default: null })
  tag: string;

  @Column({ type: 'varchar', length: 255, default: null })
  tagImage: string;

  @OneToMany(() => Posts, (posts) => posts.tags)
  post: Posts;
}
