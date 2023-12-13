import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';

@Module({
  providers: [PodcastService, PrismaService],
  controllers: [PodcastController],
  imports: [JwtModule.register({}), CloudinaryModule],
})
export class PodcastModule {}
