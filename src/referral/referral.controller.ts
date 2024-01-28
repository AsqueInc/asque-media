import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('referral-endpoints')
@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get('email')
  @ApiOperation({ summary: 'Get referral details via email' })
  getReferralDetailsViaEmail(@Req() req) {
    return this.referralService.getReferralDetailsViaEmail(req.user.email);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get referral details via code' })
  getReferralDetailsViaCode(@Param('code') code: string) {
    return this.referralService.getReferralDetailsViaCode(code);
  }
}
