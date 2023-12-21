import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { AppController } from './app.controller';

// Services
import { AuthService } from './auth/services/auth/auth.service';

// Module
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './auth/auth.module';

// Const
import { enviroments } from '../enviroments';
import config from '../config/config';
import { configSchema } from '../config/validationSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.dev.env',
      load: [config],
      isGlobal: true,
      validationSchema: configSchema,
    }),
    UsersModule,
    PostsModule,
    DatabaseModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule {}
