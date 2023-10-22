import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RequestMobileVerificationDto } from './dto/request-mobile-verification.dto';
import { VerifyMobileDto } from './dto/verify-mobile.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('profile-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create-profile')
  @ApiOperation({ summary: 'Create a profile for a user' })
  createProfile(@Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(dto);
  }

  @Patch('update-profile/:userId/:profileId')
  @ApiOperation({ summary: 'Update a user profile' })
  updateProfile(
    @Body() dto: UpdateProfileDto,
    @Param('userId') userId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.updateProfile(dto, userId, profileId);
  }

  @Get(':profileId')
  @ApiOperation({ summary: 'Get a single profile by profile id' })
  getProfile(@Param('profileId') profileId: string) {
    return this.profileService.getProfile(profileId);
  }

  @Post('request-mobile-verification')
  @ApiOperation({ summary: 'Request mobile verification otp' })
  requestMobileNumberVerification(@Body() dto: RequestMobileVerificationDto) {
    return this.profileService.requestMobileNumberVerification(dto);
  }

  @Patch('verify-mobile/:userId')
  @ApiOperation({ summary: 'Verify a mobile number' })
  verifyMobileNumber(
    @Body() dto: VerifyMobileDto,
    @Param('userId') userId: string,
  ) {
    return this.profileService.verifyMobileNumber(dto, userId);
  }

  @Patch('profile-picture/:profileId')
  @ApiOperation({ summary: 'Upload a profile picture' })
  @UseInterceptors(FileInterceptor('file'))
  uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.uploadProfilePicture(profileId, file);
  }
}
