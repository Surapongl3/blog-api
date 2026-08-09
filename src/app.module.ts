import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, BlogsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
