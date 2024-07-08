import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AdvertService, PrismaService],
  controllers: [AdvertController],
  imports: [JwtModule.register({})],
})
export class AdvertModule {}
