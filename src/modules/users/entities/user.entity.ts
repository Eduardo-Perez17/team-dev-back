import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Libreries
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

// Commons
import { ROLES } from '../../../commons/models';
import { BaseEntity } from '../../../commons/baseEntity';

// Interfaces
import { IUser } from '../../../commons/Interface/user.interface';

// Entities
import { Posts } from 'src/modules/posts/entities/posts.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 30, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: string;

  @Column({ type: 'boolean', default: false })
  register: boolean;

  @OneToMany(() => Posts, (posts) => posts)
  posts: Posts[];

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
  }
}
