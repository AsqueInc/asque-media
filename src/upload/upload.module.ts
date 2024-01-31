import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService],
  imports: [CloudinaryModule],
})
export class UploadModule {}
