import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { ApiResponse } from 'src/types/response.type';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

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
      if (!userExists) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      // hash new password
      const passwordHash = await bcrypt.hash(dto.password, 12);

      const newUser = await this.prisma.user.create({
        data: { email: dto.email, password: passwordHash },
      });

      delete newUser.password;

      return {
        statusCode: HttpStatus.CREATED,
        message: newUser,
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
  async loginUser(dto: LoginDto) {
    try {
      // check if user exists
      const userExists = await this.checkUserExistsByEmail(dto.email);
      if (!userExists) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      // check is password is correct
      const passwordMatches = bcrypt.compare(dto.password, userExists.password);
      if (!passwordMatches) {
        throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
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

  //   async requestEmailVerification() {}

  //   async verifyEmail() {}

  //   async changePassword() {}

  //   async requestForgotPasswordEmail() {}

  //   async forgotPassword() {}

  //   async refreshAccessToken() {}
}
