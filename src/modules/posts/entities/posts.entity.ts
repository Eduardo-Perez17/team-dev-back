import {
  Column,
  Entity,
  JoinColumn,
  // JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Commons
import { BaseEntity } from '../../../commons/baseEntity';

// Interfaces
import { IPost } from '../../../commons/Interface/post.interface';

// Entities
import { Tags } from 'src/modules/tags/entities/tags.entity';
import { User } from 'src/modules/users/entities/user.entity';

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

  @ManyToOne(() => Tags, (tags) => tags.post)
  @JoinColumn({ name: 'tags_id' })
  tags: Tags;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
