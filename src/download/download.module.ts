import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [DownloadService, PrismaService],
  controllers: [DownloadController],
})
export class DownloadModule {}
