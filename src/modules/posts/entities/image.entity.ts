import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

// Entities
import { Posts } from './posts.entity';

// Commons
import { BaseEntity } from '../../../commons/baseEntity';

// Interfaces
import { IImage } from 'src/commons/Interface/image.interface';

@Entity({ name: 'Image' })
export class Image extends BaseEntity implements IImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '100', default: null })
  image: string;

  @OneToOne(() => Posts, (posts) => posts.image, {
    cascade: true,
  })
  post: Posts;
}
