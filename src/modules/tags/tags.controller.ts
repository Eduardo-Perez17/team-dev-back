import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Services
import { TagsService } from './tags.service';

// Entities
import { Tags } from './entities/tags.entity';

// Commons
import { ROLES } from 'src/commons/models';

// Decorators
import { Roles } from 'src/auth/decorators/roles.decorator';

// Dtos
import { TagsCreatetDto } from './dto/createTags.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsServices: TagsService) {}

  @ApiBearerAuth()
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Post()
  createTags(@Body() body: TagsCreatetDto): Promise<Tags> {
    return this.tagsServices.createTags({ body });
  }

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
