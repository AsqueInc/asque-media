import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RequestMobileVerificationDto } from './dto/request-mobile-verification.dto';
import { VerifyMobileDto } from './dto/verify-mobile.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { WithdrawReferralEarningDto } from './dto/withdraw-referral-earning.dto';

@ApiTags('profile-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update a user profile' })
  updateProfile(@Body() dto: UpdateProfileDto, @Req() req) {
    return this.profileService.updateProfile(dto, req.user.profileId);
  }

  @Get('other/:profileId')
  @ApiOperation({ summary: 'Get profile details' })
  getProfileById(@Param('profileId') profileId: string) {
    return this.profileService.getProfileById(profileId);
  }

  @Get('own')
  @ApiOperation({ summary: 'Get own profile' })
  getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.profileId);
  }

  @Post('request-mobile-verification')
  @ApiOperation({ summary: 'Request mobile verification otp' })
  requestMobileNumberVerification(@Body() dto: RequestMobileVerificationDto) {
    return this.profileService.requestMobileNumberVerification(dto);
  }

  @Patch('verify-mobile')
  @ApiOperation({ summary: 'Verify a mobile number' })
  verifyMobileNumber(@Body() dto: VerifyMobileDto, @Req() req) {
    return this.profileService.verifyMobileNumber(dto, req.user.userId);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get a single profile by user id' })
  getProfileByUserId(@Req() req) {
    return this.profileService.getProfileByUserId(req.user.userId);
  }

  @Post('withdraw-referral-earning')
  @ApiOperation({ summary: 'Withdraw referral earning' })
  withdrawReferralEarning(@Body() dto: WithdrawReferralEarningDto, @Req() req) {
    return this.profileService.withdrawReferralEarning(req.user.profileId, dto);
  }
}
