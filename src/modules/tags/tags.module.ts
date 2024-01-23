import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controller
import { TagsController } from './tags.controller';

// Services
import { TagsService } from './tags.service';

// Entitis
import { Tags } from './entities/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tags])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
