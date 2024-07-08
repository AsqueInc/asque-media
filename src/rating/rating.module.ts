import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [RatingService, PrismaService],
  controllers: [RatingController],
  imports: [JwtModule.register({})],
})
export class RatingModule {}
