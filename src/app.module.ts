import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { AppController } from './app.controller';

// Services
import { AuthService } from './auth/services/auth/auth.service';

// Module
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './auth/auth.module';

// Const
import { configSchema } from '../config/validationSchema';
import { enviroments } from '../enviroments';
import config from '../config/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.dev.env',
      load: [config],
      isGlobal: true,
      validationSchema: configSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join('upload'),
    }),
    UsersModule,
    PostsModule,
    DatabaseModule,
    AuthModule,
    JwtModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule {}
