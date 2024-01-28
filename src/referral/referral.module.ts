import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ReferralService, PrismaService],
  controllers: [ReferralController],
  imports: [JwtModule.register({})],
})
export class ReferralModule {}
