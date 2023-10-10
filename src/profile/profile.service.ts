import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
  ) {}

  /**
   *
   * @param dto :create profile dto
   * @param userId : user id
   * @returns : status code and profile data
   */
  async createProfile(dto: CreateProfileDto) {
    // check if user exists
    const userExists = await this.prisma.profile.findFirst({
      where: { userId: dto.userId },
    });
    if (!userExists) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: { error: 'User does not exists' },
      };
    }
    // create user
    const profile = await this.prisma.profile.create({
      data: {
        firstName: dto.lastName,
        lastName: dto.firstName,
        mobileNumber: dto.mobileNumber,
        profilePicUri: dto.profilePicUri,
        userId: dto.userId,
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    };
  }

  /**
   * update profile
   * @param dto : update profile dto
   * @param userId : user id
   * @param profileId : profile id
   * @returns : status code and message
   */
  async updatedProfile(
    dto: UpdateProfileDto,
    userId: string,
    profileId: string,
  ) {
    // check if user exists
    const userExists = await this.prisma.profile.findFirst({
      where: { userId: userId },
    });
    if (!userExists) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: { error: 'User does not exists' },
      };
    }

    // check if profile exists
    const profileExists = await this.prisma.profile.findFirst({
      where: { id: profileId },
    });
    if (!profileExists) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: { error: 'User does not exists' },
      };
    }

    // update mobile verification if mobile number is provided
    if (dto.mobileNumber) {
      await this.prisma.profile.update({
        where: { id: profileId },
        data: {
          isMobileNumberVerified: false,
          firstName: dto.firstName,
          lastName: dto.lastName,
          profilePicUri: dto.profilePicUri,
          mobileNumber: dto.mobileNumber,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { error: 'Profile updated' },
      };
    }

    //update profile
    await this.prisma.profile.update({
      where: { id: profileId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        profilePicUri: dto.profilePicUri,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: { error: 'Profile updated' },
    };
  }
}
