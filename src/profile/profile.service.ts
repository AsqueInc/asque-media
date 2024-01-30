import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
// import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UtilService } from 'src/utils/util.service';
import { Profile } from '@prisma/client';
import { RequestMobileVerificationDto } from './dto/request-mobile-verification.dto';
import { ApiResponse } from 'src/types/response.type';
import { VerifyMobileDto } from './dto/verify-mobile.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MessageService } from 'src/utils/message.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private util: UtilService,
    private messageSerive: MessageService,
    private cloudinary: CloudinaryService,
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
   * update profile
   * @param dto : update profile dto
   * @param userId : user id
   * @param profileId : profile id
   * @returns : status code and message
   */
  async updateProfile(
    dto: UpdateProfileDto,
    userId: string,
    profileId: string,
  ): Promise<ApiResponse> {
    try {
      // check if user exists
      const userExists = await this.prisma.profile.findFirst({
        where: { user: { id: userId } },
      });
      if (!userExists) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      // check if profile exists
      const profileExists = await this.prisma.profile.findFirst({
        where: { id: profileId },
        include: { user: { select: { id: true } } },
      });
      if (!profileExists) {
        throw new HttpException(
          'Profile does not exists',
          HttpStatus.NOT_FOUND,
        );
      }

      if (userExists.id !== profileExists.user.id) {
        throw new HttpException(
          'You can only update a profile that belongs to you',
          HttpStatus.NOT_FOUND,
        );
      }

      //update profile
      await this.prisma.profile.update({
        where: { id: profileId },
        data: {
          name: dto.name,
          mobileNumber: dto.mobileNumber
            ? this.util.parseMobileNumber(dto.mobileNumber)
            : profileExists.mobileNumber,
          isMobileNumberVerified: dto.mobileNumber
            ? false
            : profileExists.isMobileNumberVerified,
          profilePicUri: dto.profilePicUri,
          briefBio: dto.briefBio,
          websiteLink: dto.websiteLink,
          socialMediaHandle: dto.socialMediaHandle,
          bank: dto.bank,
          accountName: dto.accountName,
          accountNumber: dto.accountNumber,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Profile updated',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * get a user profile by id
   * @param profileId : profile id
   * @returns profile
   */
  async getProfile(profileId: string): Promise<ApiResponse> {
    try {
      // check if profile exists
      const profileExists = await this.checkProfileExistsById(profileId);
      if (!profileExists) {
        throw new HttpException(
          'Profile does not exists',
          HttpStatus.NOT_FOUND,
        );
      }

      return { statusCode: HttpStatus.OK, data: profileExists };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
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
        include: { user: { select: { id: true } } },
      });
      if (!numberExists) {
        throw new HttpException(
          'You do not have a saved number. Update your profile and try again',
          HttpStatus.NOT_FOUND,
        );
      }

      // check if user is already verified
      if (numberExists.isMobileNumberVerified === true) {
        throw new HttpException(
          'User has already been verified',
          HttpStatus.BAD_REQUEST,
        );
      }

      // generate otp and send message to user
      const otp = this.util.generateOtp();

      // sign otp with jwt

      await this.messageSerive.sendTestMessage(
        numberExists.mobileNumber,
        `your mobile verification otp is : ${otp}. do not share with anyone`,
      );

      // save otp
      await this.prisma.otp.create({
        data: { userId: numberExists.user.id, otp: otp },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Mobile verification otp sent',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * verify user mobile number
   * @param dto : verify mobile dto
   * @param userId : user id
   * @returns status code and message
   */
  async verifyMobileNumber(
    dto: VerifyMobileDto,
    userId: string,
  ): Promise<ApiResponse> {
    try {
      // check if otp is valid
      const otpExists = await this.prisma.otp.findFirst({
        where: { userId: userId, otp: dto.otp },
        include: { user: { select: { email: true } } },
      });

      if (!otpExists) {
        throw new HttpException('Invalid otp', HttpStatus.UNAUTHORIZED);
      }

      // verify mobile number
      await this.prisma.profile.update({
        where: { userEmail: otpExists.user.email },
        data: { isMobileNumberVerified: true },
      });

      // remove otp from database
      await this.prisma.otp.delete({ where: { id: otpExists.id } });

      // send confirmation message
      await this.messageSerive.sendTestMessage(
        dto.mobileNumber,
        `Your mobile number has been verified`,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Mobile number succeffully verified',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadProfilePicture(
    profileId: string,
    file: Express.Multer.File,
  ): Promise<ApiResponse> {
    try {
      // upload image of artwork
      const uploadedProfilePicture =
        await this.cloudinary.uploadProfilePicture(file);

      // update profile with profile picture public id
      await this.prisma.profile.update({
        where: { id: profileId },
        data: { profilePicUri: uploadedProfilePicture.url },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Profile picture updated',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * get th details of a profile by user id
   * @param userId : id of user
   * @returns status code and user object
   */
  async getProfileByUserId(userId: string) {
    // check if profile exists
    const profile = await this.prisma.profile.findFirst({
      where: { user: { id: userId } },
    });
    if (!profile) {
      throw new HttpException('Profile does not exists', HttpStatus.NOT_FOUND);
    }

    return { statusCode: HttpStatus.OK, message: { profile } };
  }
  catch(error) {
    this.logger.error(error);
    throw new HttpException(
      error.message,
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
