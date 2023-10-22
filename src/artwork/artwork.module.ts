import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { ArtworkController } from './artwork.controller';
import { FileUploadService } from 'src/utils/file-upload.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ArtworkService, FileUploadService, PrismaService],
  controllers: [ArtworkController],
  imports: [JwtModule.register({})],
})
export class ArtworkModule {}
