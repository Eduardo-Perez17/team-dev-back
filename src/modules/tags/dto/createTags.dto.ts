import { IsNotEmpty, IsString } from 'class-validator';

export class TagsCreatetDto {
  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsString()
  tagImage: string;
}

export class ResponseTagsCreateDto {
  tag: string;
  tagImage: string;
}
