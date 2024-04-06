import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: configService.get('EMAIL_CLIENT_ID'),
      clientSecret: configService.get('EMAIL_CLIENT_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  /**
   * function to sign tokens
   * @param userId : suer id
   * @param email : email of user
   * @param secret : jwt secret
   * @param expiresIn : time for token to expire
   * @returns token
   */
  async signToken(
    userId: string,
    email: string,
    secret: string,
    profileId: string,
    role: Role,
    expiresIn: string,
  ) {
    // sign token
    return await this.jwtService.signAsync(
      {
        userId: userId,
        email: email,
        profileId: profileId,
        role: role,
      },
      {
        secret: secret,
        expiresIn: expiresIn,
      },
    );
  }

  async validate(
    googleAccessToken: string,
    googleRefreshToken: string,
    profile: Profile,
  ): Promise<any> {
    try {
      // check if user with email already exists
      const userExists = await this.prisma.user.findFirst({
        where: { email: profile._json.email },
        // include: { profile: true },
      });

      if (!userExists) {
        // create new user if user does not exist
        const googleUser = await this.authService.registerGoogleUser(
          profile._json.email,
          profile._json.name,
        );

        // create access token
        const accessToken = await this.signToken(
          googleUser.data.id,
          googleUser.data.email,
          this.configService.get('JWT_ACCESS_SECRET'),
          googleUser.data.profile.id,
          'USER',
          this.configService.get('JWT_EXPIRES_IN'),
        );

        // create refresh token
        const refreshToken = await this.signToken(
          googleUser.data.id,
          googleUser.data.email,
          this.configService.get('JWT_ACCESS_SECRET'),
          googleUser.data.profile.id,
          'USER',
          '7d',
        );

        await this.prisma.user.update({
          where: { id: googleUser.data.id },
          data: { refreshToken: refreshToken },
        });

        return {
          accessToken: accessToken,
          userId: googleUser.data.id,
          profileId: googleUser.data.profile.id,
          email: googleUser.data.email,
          role: googleUser.data.role,
          googleAccessToken: googleAccessToken,
          googleRefreshToken: googleRefreshToken,
        };
      }

      // save refresh token to db if user exists
      if (userExists) {
        const profile = await this.prisma.profile.findFirst({
          where: { user: { id: userExists }.id },
        });
        // create access token
        const accessToken = await this.signToken(
          userExists.id,
          userExists.email,
          this.configService.get('JWT_ACCESS_SECRET'),
          profile.id,
          'USER',
          this.configService.get('JWT_EXPIRES_IN'),
        );

        // create refresh token
        const refreshToken = await this.signToken(
          userExists.id,
          userExists.email,
          this.configService.get('JWT_REFRESH_SECRET'),
          profile.id,
          'USER',
          '7d',
        );

        await this.prisma.user.update({
          where: { id: userExists.id },
          data: { refreshToken: refreshToken },
        });

        return {
          accessToken: accessToken,
          userId: userExists.id,
          profileId: profile.id,
          email: userExists.email,
          role: userExists.role,
          googleAccessToken: googleAccessToken,
          googleRefreshToken: googleRefreshToken,
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
