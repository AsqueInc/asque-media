import { Module } from '@nestjs/common';
import { AudioVideoService } from './audio-video.service';
import { AudioVideoController } from './AudioVideoController';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AudioVideoService, PrismaService],
  controllers: [AudioVideoController],
  imports: [JwtModule.register({}), CloudinaryModule],
})
export class AudioVideoModule {}
