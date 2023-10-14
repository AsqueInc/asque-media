import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RequestMobileVerificationDto } from './dto/request-mobile-verification.dto';
import { VerifyMobileDto } from './dto/verify-mobile.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('profile-endpoints')
@UseGuards(AuthGuard)
@ApiSecurity('JWT-auth')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create-profile')
  createProfile(@Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(dto);
  }

  @Patch('update-profile/:userId/:profileId')
  updateProfile(
    @Body() dto: UpdateProfileDto,
    @Param('userId') userId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.updateProfile(dto, userId, profileId);
  }

  @Get(':profileId')
  getProfile(@Param('profileId') profileId: string) {
    return this.profileService.getProfile(profileId);
  }

  @Post('request-mobile-verification')
  requestMobileNumberVerification(@Body() dto: RequestMobileVerificationDto) {
    return this.profileService.requestMobileNumberVerification(dto);
  }

  @Patch('verify-mobile/:userId')
  verifyMobileNumber(
    @Body() dto: VerifyMobileDto,
    @Param('userId') userId: string,
  ) {
    return this.profileService.verifyMobileNumber(dto, userId);
  }
}
