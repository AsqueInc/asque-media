import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { RateItemDto } from './dto/rate-item.dto';
import { ApiResponse } from 'src/types/response.type';

@Injectable()
export class RatingService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * rate an album, artwork or story
   * @param profileId : id of the user
   * @param dto : rate item dto with itemId and itemType fields
   * @returns : status code and data
   */
  async rateItem(profileId: string, dto: RateItemDto): Promise<ApiResponse> {
    try {
      const likeDetails = await this.prisma.like.create({
        data: {
          itemId: dto.itemId,
          itemType: dto.itemType,
          profile: { connect: { id: profileId } },
        },
      });

      return { statusCode: HttpStatus.OK, data: likeDetails };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
