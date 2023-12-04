import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [BlogController],
  providers: [BlogService, PrismaService],
  imports: [JwtModule.register({})],
})
export class BlogModule {}
