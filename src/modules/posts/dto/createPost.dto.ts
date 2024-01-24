import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

// Enums
import { TypePost } from 'src/commons/enums/typePost.enums';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  url: string;

  @IsNotEmpty()
  @IsBoolean()
  published: boolean;

  @IsNotEmpty()
  @Transform(({ value }) => ('' + value).toLocaleUpperCase())
  @IsEnum(TypePost)
  type: TypePost;

  @IsNotEmpty()
  tagsId: number;
}

export class ResponseCreatePostDto {
  id: number;
  title: string;
  content: string;
  img: string;
  url: string;
  published: boolean;
  deleteAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
