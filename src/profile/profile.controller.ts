import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  // Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
// import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
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

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update a user profile' })
  updateProfile(
    @Body() dto: UpdateProfileDto,
    @Req() req,
    // @Param('userId') userId: string,
    // @Param('profileId') profileId: string,
  ) {
    return this.profileService.updateProfile(
      dto,
      req.user.userId,
      req.user.profileId,
    );
  }

  @Get('')
  @ApiOperation({ summary: 'Get a single profile by profile id' })
  getProfile(
    @Req() req,
    // @Param('profileId') profileId: string
  ) {
    return this.profileService.getProfile(req.user.profileId);
  }

  @Post('request-mobile-verification')
  @ApiOperation({ summary: 'Request mobile verification otp' })
  requestMobileNumberVerification(@Body() dto: RequestMobileVerificationDto) {
    return this.profileService.requestMobileNumberVerification(dto);
  }

  @Patch('verify-mobile')
  @ApiOperation({ summary: 'Verify a mobile number' })
  verifyMobileNumber(
    @Body() dto: VerifyMobileDto,
    // @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.profileService.verifyMobileNumber(dto, req.user.userId);
  }

  @Patch('profile-picture')
  @ApiOperation({ summary: 'Upload a profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadProfilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    file: Express.Multer.File,
    // @Param('profileId') profileId: string,
    @Req() req,
  ) {
    return this.profileService.uploadProfilePicture(req.user.profileId, file);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get a single profile by user id' })
  getProfileByUserId(
    @Req() req,
    // @Param('userId') userId: string
  ) {
    return this.profileService.getProfileByUserId(req.user.userId);
  }
}
