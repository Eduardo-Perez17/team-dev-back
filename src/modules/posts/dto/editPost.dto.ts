import { PartialType } from '@nestjs/swagger';

// DTO'S
import { CreatePostDto } from './createPost.dto';

export class EditPostDto extends PartialType(CreatePostDto) {}
