import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/utils/util.service';

@Module({
  providers: [ProfileService, PrismaService, UtilService],
  controllers: [ProfileController],
})
export class ProfileModule {}
