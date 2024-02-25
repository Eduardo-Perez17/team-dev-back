import { PartialType } from '@nestjs/swagger';

// DTO'S
import { CreatePostDto } from './createPost.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// Entities
import { User } from 'src/modules/users/entities/user.entity';
import { TypePost } from 'src/commons/enums/typePost.enums';

export class EditPostDto extends PartialType(CreatePostDto) {

  @IsOptional()
  @IsNumber()
  likes: User

  @IsOptional()
  @IsNumber()
  dislikes: User

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  published: boolean;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @IsNumber()
  type: TypePost;

  @IsOptional()
  @IsNumber()
  user: User;

  @IsOptional()
  @IsNumber()
  saved_posts: User;
}
