import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AdvertController } from './advert.controller';

@Module({
  providers: [AdvertService, PrismaService],
  controllers: [AdvertController],
  imports: [JwtModule.register({})],
})
export class AdvertModule {}
