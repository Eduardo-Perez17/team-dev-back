import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Commons
import { BaseEntity } from '../../../commons/baseEntity';

// Interfaces
import { IPost } from '../../../commons/Interface/post.interface';

@Entity({ name: 'Posts' })
export class Posts extends BaseEntity implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', default: null })
  content: string;

  @Column({ type: 'varchar', length: 50, default: null })
  img: string;

  @Column({ type: 'boolean', default: true })
  published: boolean;

  @Column({ type: 'varchar', length: 50, default: null })
  tag: string;

  @Column({ type: 'varchar', length: 50, default: null })
  title: string;

  @Column({ type: 'varchar', length: 50, default: null, unique: true })
  url: string;
}
