import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      // get payload details
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });

      // get email from payload
      const { email } = payload;

      if (request.params.profileId) {
        this.protectProfile(request.params.profileId, email);
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * check to see if profileId in params and profileId gotten from email in decoded token are similar
   * @param profileId : profileId from params
   * @param email : email gotten from decoded token
   */
  private async protectProfile(
    profileId: string,
    email: string,
  ): Promise<boolean> {
    try {
      const profileFromPayload = await this.prisma.profile.findFirst({
        where: { email: email },
      });

      if (profileId !== profileFromPayload.id) {
        throw new UnauthorizedException(
          'You can only use your profile id for this',
        );
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
