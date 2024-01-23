import { Controller, Get, Param } from '@nestjs/common';

// Services
import { TagsService } from './tags.service';
import { Tags } from './entities/tags.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLES } from 'src/commons/models';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsServices: TagsService) {}

  @ApiBearerAuth()
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get()
  getAllTags(): Promise<Tags[]> {
    return this.tagsServices.getAllTags();
  }

  @ApiBearerAuth()
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get(':id')
  getTagById(@Param('id') id: number): Promise<Tags> {
    return this.tagsServices.getTagById({ id });
  }
}
