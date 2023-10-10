import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('profile-endpoints')
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
    return this.profileService.updatedProfile(dto, userId, profileId);
  }

  @Get(':profileId')
  getProfile(@Param('profileId') profileId: string) {
    return this.profileService.getProfile(profileId);
  }
}
