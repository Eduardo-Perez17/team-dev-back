import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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
  @IsString()
  tag: string;
}

export class ResponseCreatePostDto {
  id: number;
  title: string;
  content: string;
  img: string;
  url: string;
  published: boolean;
  tag: string;
  deleteAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
