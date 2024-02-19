import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Commons
import { BaseEntity } from '../../../commons/baseEntity';

// Interfaces
import { IPost } from '../../../commons/Interface/post.interface';

// Entities
import { Tags } from '../../tags/entities/tags.entity';
import { User } from '../../users/entities/user.entity';

// Enums
import { TypePost } from '../../../commons/enums/typePost.enums';

@Entity({ name: 'Posts' })
export class Posts extends BaseEntity implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', default: null })
  content: string;

  @Column({ type: 'boolean', default: true })
  published: boolean;

  @Column({ type: 'varchar', length: 150, default: null })
  title: string;

  @Column({ type: 'varchar', length: 150, default: null, unique: true })
  url: string;

  @Column({ type: 'enum', enum: TypePost })
  type: TypePost;

  @ManyToOne(() => Tags, (tags) => tags.post)
  @JoinColumn({ name: 'tags_id' })
  tags: Tags;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_saved_id' })
  saved_posts: User;
}
