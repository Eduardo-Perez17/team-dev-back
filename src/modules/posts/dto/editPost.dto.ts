import { PartialType } from '@nestjs/swagger';

// DTO'S
import { CreatePostDto } from './createPost.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class EditPostDto extends PartialType(CreatePostDto) {

  @IsOptional()
  @IsNumber()
  likes: number

  @IsOptional()
  @IsNumber()
  dislikes: number
}
