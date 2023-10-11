import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UtilService } from 'src/utils/util.service';
import { Profile } from '@prisma/client';
import { RequestMobileVerificationDto } from './dto/request-mobile-verification.dto';
import { ApiResponse } from 'src/types/response.type';
import { VerifyMobileDto } from './dto/verify-mobile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
    private util: UtilService,
  ) {}

  /**
   * checks if a profile exists or not by id
   * @param id : string
   * @returns : user object or null
   */
  checkProfileExistsById = async (id: string): Promise<Profile | null> => {
    return await this.prisma.profile.findFirst({ where: { id: id } });
  };

  /**
   *
   * @param dto :create profile dto
   * @param userId : user id
   * @returns : status code and profile data
   */
  async createProfile(dto: CreateProfileDto): Promise<ApiResponse> {
    try {
      // check if user exists
      const userExists = await this.prisma.user.findFirst({
        where: { id: dto.userId },
      });
      if (!userExists) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: { error: 'User does not exists' },
        };
      }

      // chech if profile already exists
      const profileExists = await this.prisma.profile.findFirst({
        where: { userId: dto.userId },
      });
      if (profileExists) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: { error: 'Profile already exists' },
        };
      }

      // create user
      const profile = await this.prisma.profile.create({
        data: {
          firstName: dto.lastName,
          lastName: dto.firstName,
          mobileNumber: this.util.parseMobileNumber(dto.mobileNumber),
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
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
  ): Promise<ApiResponse> {
    try {
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

      // change mobile verification status to false if new mobile number is provided
      if (dto.mobileNumber) {
        await this.prisma.profile.update({
          where: { id: profileId },
          data: {
            isMobileNumberVerified: false,
            firstName: dto.firstName,
            lastName: dto.lastName,
            profilePicUri: dto.profilePicUri,
            mobileNumber: this.util.parseMobileNumber(dto.mobileNumber),
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
        message: { message: 'Profile updated' },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * get a user profile by id
   * @param profileId : profile id
   * @returns profile
   */
  async getProfile(profileId: string) {
    try {
      // check if profile exists
      const profileExists = await this.checkProfileExistsById(profileId);
      if (!profileExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: { error: 'Profile does not exist' },
        };
      }

      return { statusCode: HttpStatus.OK, message: { profileExists } };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * send mobile verification otp to user via text message
   * @param dto : request mobile verification dto
   * @returns : status code and message
   */
  async requestMobileNumberVerification(
    dto: RequestMobileVerificationDto,
  ): Promise<ApiResponse> {
    try {
      // check if user's mobile number is saved.
      const numberExists = await this.prisma.profile.findFirst({
        where: { mobileNumber: dto.mobileNumber },
      });
      if (!numberExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: {
            error:
              'You do not have a saved number. Update your profile and try again',
          },
        };
      }

      // check if user is already verified
      if (numberExists.isMobileNumberVerified === true) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: {
            error: 'User has already been verified',
          },
        };
      }

      // generate otp and send message to user
      const otp = this.util.generateOtp();

      await this.util.sendTestMessage(
        numberExists.mobileNumber,
        `your mobile verification otp is : ${otp}. do not share with anyone`,
      );

      // save otp
      await this.prisma.otp.create({
        data: { userId: numberExists.userId, otp: otp },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { message: 'Mobile verification otp sent' },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * verify user mobile number
   * @param dto : verify mobile dto
   * @param userId : user id
   * @returns status code and message
   */
  async verifyMobileNumber(dto: VerifyMobileDto, userId: string) {
    try {
      // check if otp is valid
      const otpExists = await this.prisma.otp.findFirst({
        where: { userId: userId, otp: dto.otp },
      });

      if (!otpExists) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: {
            error: 'Invalid otp',
          },
        };
      }

      // verify mobile number
      await this.prisma.profile.update({
        where: { userId: userId },
        data: { isMobileNumberVerified: true },
      });

      // remove otp from database
      await this.prisma.otp.delete({ where: { id: otpExists.id } });

      // send confirmation message
      await this.util.sendTestMessage(
        dto.mobileNumber,
        `Your mobile number has been verified`,
      );

      return {
        statusCode: HttpStatus.OK,
        message: { message: 'Mobile number succeffully verified' },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
