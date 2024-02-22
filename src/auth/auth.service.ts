import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { ApiResponse } from 'src/types/response.type';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UtilService } from 'src/utils/util.service';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { VerifyEmailDto } from './dto/verify-email.otp';
import { SendResetPasswordEmailDto } from './dto/send-reset-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AddAdminDto } from './dto/add-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly util: UtilService,
    private readonly email: EmailNotificationService,
  ) {}

  /**
   * checks if a user exists or not by email
   * @param email : string
   * @returns : user object or null
   */
  checkUserExistsByEmail = async (email: string) => {
    return await this.prisma.user.findFirst({
      where: { email: email },
      include: { profile: { select: { id: true } } },
    });
  };

  /**
   * checks if a user exists or not by id
   * @param id : string
   * @returns : user object or null
   */
  checkUserExistsById = async (id: string): Promise<User | null> => {
    return await this.prisma.user.findFirst({ where: { id: id } });
  };

  /**
   * register a new user
   * @param dto : register user dto
   * @returns : response code and user details
   */
  async registerUser(dto: RegisterUserDto): Promise<ApiResponse> {
    try {
      if (dto.type === 'ADMIN') {
        throw new HttpException(
          'You cannot create an admin',
          HttpStatus.UNAUTHORIZED,
        );
      }
      // check if user already exists
      const userExists = await this.checkUserExistsByEmail(dto.email);
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.UNAUTHORIZED);
      }

      // hash new password
      const passwordHash = await bcrypt.hash(dto.password, 12);

      // generate referral code for user
      const referralCode = this.util.generateReferralCode();

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: passwordHash,
          role: dto.type,
          profile: {
            create: {
              name: dto.name,
            },
          },
          referral: {
            create: {
              code: referralCode,
            },
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              id: true,
              name: true,
              earning: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          referral: {
            select: {
              id: true,
              code: true,
              balance: true,
            },
          },
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: user,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerGoogleUser(email: string, name: string) {
    try {
      // generate referral code for user
      const referralCode = this.util.generateReferralCode();

      const googleUser = await this.prisma.user.create({
        data: {
          email: email,
          isGoogleUser: true,
          // refreshToken: refreshToken,
          // password: null,
          role: 'USER',
          profile: {
            create: {
              name: name,
            },
          },
          referral: {
            create: {
              code: referralCode,
            },
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              id: true,
              name: true,
              earning: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          referral: {
            select: {
              id: true,
              code: true,
              balance: true,
            },
          },
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: googleUser,
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
   * login a user
   * @param dto : login user dto
   * @returns : status code, access and refresh tokens
   */
  async loginUser(dto: LoginDto): Promise<ApiResponse> {
    try {
      // check if user exists
      const userExists = await this.checkUserExistsByEmail(dto.email);
      if (!userExists) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      // ensure google user can only login via google
      if (userExists.isGoogleUser === true) {
        throw new HttpException(
          'You can only login via google as you registered via google',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // check is password is correct
      const passwordMatches = await bcrypt.compare(
        dto.password,
        userExists.password,
      );

      if (!passwordMatches) {
        throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
      }

      const payload = {
        userId: userExists.id,
        email: userExists.email,
        profileId: userExists.profile.id,
        role: userExists.role,
      };

      // sign access token
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: this.config.get('JWT_EXPIRES_IN'),
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });

      // sign refresh token
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      await this.prisma.user.update({
        where: { id: userExists.id },
        data: { refreshToken: refreshToken },
      });

      return {
        statusCode: HttpStatus.OK,
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
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
   * change user password
   * @param dto : change password dto
   * @param id : user id
   * @returns status code and message
   */
  async changePassword(
    dto: ChangePasswordDto,
    userId: string,
  ): Promise<ApiResponse> {
    try {
      const userExists = await this.checkUserExistsById(userId);
      if (!userExists) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      // check if old password is correct
      const isPasswordCorrect = await bcrypt.compare(
        dto.oldPassword,
        userExists.password,
      );
      if (!isPasswordCorrect) {
        throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
      }

      const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: newPasswordHash },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Password change successful',
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
   * send email verification otp to user
   * @param userId : user id
   * @returns status code and message
   */
  async requestEmailVerification(userId: string): Promise<ApiResponse> {
    try {
      const userExists = await this.checkUserExistsById(userId);
      if (!userExists) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      // generate otp
      const otp = this.util.generateOtp();

      // send verification email
      await this.email.sendOtpEmail(userExists.email, otp);

      const payload = { otp: otp };

      // sign otp
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '5m',
        secret: this.config.get('OTP_SECRET'),
      });

      // save signed otp to database
      await this.prisma.otp.create({ data: { otp: token, userId: userId } });

      return {
        statusCode: HttpStatus.OK,
        message: 'Email verification otp sent',
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
   * Verify a user email
   * @param userId : user id
   * @param dto : verify email dto
   * @returns : status code and message
   */
  async verifyEmail(userId: string, dto: VerifyEmailDto): Promise<ApiResponse> {
    try {
      // get user details
      const user = await this.checkUserExistsById(userId);
      if (!user) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      // get otp details
      const userToken = await this.prisma.otp.findFirst({
        where: { userId: user.id },
      });
      if (!userToken) {
        throw new HttpException('Otp does not exists', HttpStatus.NOT_FOUND);
      }

      // decpde token from db
      const decodedOtp = await this.jwtService.verifyAsync(userToken.otp, {
        secret: this.config.get('OTP_SECRET'),
      });

      if (!decodedOtp || decodedOtp.otp !== dto.otp) {
        throw new HttpException('Invalid otp', HttpStatus.UNAUTHORIZED);
      }

      // update user verification status
      await this.prisma.user.update({
        where: { id: userId },
        data: { isEmailVerified: true },
      });

      //delete otp
      await this.prisma.otp.delete({ where: { id: userToken.id } });

      return {
        statusCode: HttpStatus.OK,
        message: 'Email successfully verified',
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
   * send reset password email
   * @param dto : send reset password email
   * @returns status code and message
   */
  async requestForgotPasswordEmail(
    dto: SendResetPasswordEmailDto,
  ): Promise<ApiResponse> {
    try {
      // get user details
      const userExists = await this.checkUserExistsByEmail(dto.email);
      if (!userExists) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      // generate and send otp
      const otp = this.util.generateOtp();
      await this.email.sendForgotPasswordEmail(dto.email, otp);

      const payload = { otp: otp };

      // sign otp
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '5m',
        secret: this.config.get('OTP_SECRET'),
      });

      // save otp to database
      await this.prisma.otp.create({
        data: { otp: token, userId: userExists.id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Reset otp sent',
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
   * reset user password
   * @param dto : reset password dto
   * @returns : status code and message
   */
  async resetPassword(dto: ResetPasswordDto): Promise<ApiResponse> {
    try {
      if (dto.newPassword !== dto.confirmNewPassword) {
        throw new HttpException(
          'New password and confirm new password must be the same',
          HttpStatus.BAD_REQUEST,
        );
      }

      // get user details
      const userExists = await this.checkUserExistsByEmail(dto.email);
      if (!userExists) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      // get current otp in database
      const userOtp = await this.prisma.otp.findFirst({
        where: { userId: userExists.id },
      });
      if (!userOtp) {
        throw new HttpException('Otp not found', HttpStatus.NOT_FOUND);
      }

      const decodedOtp = await this.jwtService.verifyAsync(userOtp.otp, {
        secret: this.config.get('OTP_SECRET'),
      });

      // check if user otp and otp provided are the same
      if (!decodedOtp || decodedOtp.otp !== dto.otp) {
        throw new HttpException('Invalid Otp', HttpStatus.BAD_REQUEST);
      }

      // hash new password and update password field in db
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(dto.newPassword, saltRounds);

      await this.prisma.user.update({
        where: { email: dto.email },
        data: { password: newPasswordHash },
      });

      // delete otp after updating password
      await this.prisma.otp.delete({ where: { id: userOtp.id } });

      return {
        statusCode: HttpStatus.OK,
        message: 'Password reset successful',
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
   * get user details
   * @param userId : user id
   * @returns : status code and message containing user data
   */
  async getUserDetailsById(userId: string) {
    try {
      const userExists = await this.checkUserExistsById(userId);
      if (!userExists) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      // strip password and refreshToken
      delete userExists.password;
      delete userExists.refreshToken;

      return {
        statusCode: HttpStatus.OK,
        message: {
          data: userExists,
        },
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
   * make a user an admin
   * @param adminId : id of the admin
   * @param userId : id of user to be made admin
   * @returns : status code and message
   */
  async addAdmin(adminId: string, dto: AddAdminDto): Promise<ApiResponse> {
    try {
      const admin = await this.prisma.user.findFirst({
        where: { id: adminId },
      });
      if (admin.role !== 'ADMIN') {
        throw new HttpException(
          'Only admins can add new admin users',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.update({
        where: { email: dto.email },
        data: { role: 'ADMIN' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'User upgraded to admin status',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
