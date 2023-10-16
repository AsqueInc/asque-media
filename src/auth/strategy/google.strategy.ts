import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: configService.get('AUTH_CLIENT_ID'),
      clientSecret: configService.get('AUTH_CLIENT_SECRET'),
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
    expiresIn: string,
  ) {
    const payload = { sub: userId, email: email };

    // sign token
    return await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  async validate(
    googleAccessToken: string,
    googleRefreshToken: string,
    profile: Profile,
  ): Promise<any> {
    try {
      console.log(googleAccessToken);
      console.log(googleRefreshToken);

      // check if user with email already exists
      const userExists = await this.prisma.user.findFirst({
        where: { email: profile._json.email },
      });
      // create token if user exists
      if (userExists) {
        const accessToken = await this.signToken(
          userExists.id,
          userExists.email,
          this.configService.get('JWT_ACCESS_SECRET'),
          '15m',
        );
        const refreshToken = await this.signToken(
          userExists.id,
          userExists.email,
          this.configService.get('JWT_REFRESH_SECRET'),
          '7d',
        );

        // save refresh token to user table
        await this.prisma.user.update({
          where: { id: userExists.id },
          data: { refreshToken: refreshToken },
        });

        return {
          accessToken,
          userId: userExists.id,
          userEmail: userExists.email,
        };
      }

      // create new user if user does not exist
      const newUser = await this.prisma.user.create({
        data: {
          email: profile._json.email,
          isEmailVerified: true,
          isGoogleUser: true,
        },
      });

      const accessToken = await this.signToken(
        newUser.id,
        newUser.email,
        this.configService.get('JWT_ACCESS_SECRET'),
        '15m',
      );
      const refreshToken = await this.signToken(
        newUser.id,
        newUser.email,
        this.configService.get('JWT_REFRESH_SECRET'),
        '7d',
      );

      // save refresh token to user table
      await this.prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken: refreshToken },
      });

      return {
        accessToken,
        userId: userExists.id,
        userEmail: userExists.email,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
