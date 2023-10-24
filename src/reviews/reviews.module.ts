import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ProfileService } from 'src/profile/profile.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from 'src/utils/util.service';

@Module({
  providers: [ReviewsService, ProfileService, PrismaService, UtilService],
  controllers: [ReviewsController],
  imports: [JwtModule.register({})],
})
export class ReviewsModule {}
