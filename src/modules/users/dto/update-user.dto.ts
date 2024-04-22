import { IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// DTO'S
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  readonly register?: boolean;
}
