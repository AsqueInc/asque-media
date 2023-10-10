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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
  ) {}

  /**
   * checks if a user exists or not by email
   * @param email : string
   * @returns : user object or null
   */
  checkUserExistsByEmail = async (email: string): Promise<User | null> => {
    return await this.prisma.user.findFirst({ where: { email: email } });
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
      // check if user already exists
      const userExists = await this.checkUserExistsByEmail(dto.email);
      if (userExists) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: { error: 'User already exists' },
        };
      }

      // hash new password
      const passwordHash = await bcrypt.hash(dto.password, 12);

      const newUser = await this.prisma.user.create({
        data: { email: dto.email, password: passwordHash },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: {
          id: newUser.id,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
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
   * login a user
   * @param dto : login user dto
   * @returns : status code, access and refresh tokens
   */
  async loginUser(dto: LoginDto): Promise<ApiResponse> {
    try {
      // check if user exists
      const userExists = await this.checkUserExistsByEmail(dto.email);
      if (!userExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: { error: 'User does not exist' },
        };
      }

      // check is password is correct
      const passwordMatches = await bcrypt.compare(
        dto.password,
        userExists.password,
      );

      if (!passwordMatches) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: { error: 'Incorrect password' },
        };
      }

      const payload = { sub: userExists.id, email: userExists.email };

      // sign access token
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });

      // sign refresh token
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      return {
        statusCode: HttpStatus.OK,
        message: { accessToken: accessToken, refreshToken: refreshToken },
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
   * change user password
   * @param dto : change password dto
   * @param id : user id
   * @returns status code and message
   */
  async changePassword(dto: ChangePasswordDto, userId: string) {
    try {
      const userExists = await this.checkUserExistsById(userId);
      if (!userExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: { error: 'User does not exist' },
        };
      }

      // check if old password is correct
      const isPasswordCorrect = await bcrypt.compare(
        dto.oldPassword,
        userExists.password,
      );
      if (!isPasswordCorrect) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: { error: 'Incorrect password' },
        };
      }

      const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: newPasswordHash },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   async requestEmailVerification() {}

  //   async verifyEmail() {}

  //   async requestForgotPasswordEmail() {}

  //   async forgotPassword() {}

  //   async refreshAccessToken() {}
}
