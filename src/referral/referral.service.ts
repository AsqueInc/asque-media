import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReferralService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getReferralDetailsViaEmail(email: string) {
    try {
      const referral = await this.prisma.referral.findFirst({
        where: { userEmail: email },
      });

      if (!referral) {
        throw new HttpException(
          'Referral details not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: referral,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getReferralDetailsViaCode(code: string) {
    try {
      const referral = await this.prisma.referral.findFirst({
        where: { code: code },
      });

      if (!referral) {
        throw new HttpException(
          'Referral details not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: referral,
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
