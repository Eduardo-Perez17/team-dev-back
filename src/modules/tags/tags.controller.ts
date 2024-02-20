import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Services
import { TagsService } from './tags.service';

// Entities
import { Tags } from './entities/tags.entity';

// Commons
import { ROLES } from 'src/commons/models';

// Dtos
import { ResponseTagsCreateDto, TagsCreatetDto } from './dto/createTags.dto';

// Auth
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsServices: TagsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Tag.',
    description: 'this endpoint is for create a tag for post.',
  })
  @ApiBody({
    type: TagsCreatetDto,
    description: 'The fields to be created.',
  })
  @ApiResponse({
    status: 201,
    type: ResponseTagsCreateDto,
    description: 'create tag successfully.',
  })
  @ApiResponse({
    status: 409,
    type: () => 'CONFLICT',
    description: 'The tag already exists.',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Post()
  createTags(@Body() body: TagsCreatetDto): Promise<Tags> {
    return this.tagsServices.createTags({ body });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all Tags.',
    description: 'this endpoint is for get all tags.',
  })
  @ApiResponse({
    status: 200,
    type: [Tags],
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get()
  getAllTags(): Promise<Tags[]> {
    return this.tagsServices.getAllTags();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get tag by id.',
    description: 'this endpoint is for get tag by id.',
  })
  @ApiResponse({
    status: 200,
    type: Tags,
    description: 'response get tag by id.',
  })
  @ApiResponse({
    status: 404,
    type: () => 'NOT_FOUND',
    description: 'The tag not found.',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.SUPERADMIN, ROLES.ADMIN)
  @Get(':id')
  getTagById(@Param('id') id: number): Promise<Tags> {
    return this.tagsServices.getTagById({ id });
  }
}
