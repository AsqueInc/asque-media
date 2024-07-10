import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { ApiResponse } from 'src/types/response.type';

@Injectable()
export class AdvertService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createAdvert(
    profileId: string,
    dto: CreateAdvertDto,
  ): Promise<ApiResponse> {
    try {
      const advert = await this.prisma.advert.create({
        data: {
          text: dto.text,
          link: dto.link,
          imageUris: dto.imageUris,
          title: dto.title,
          profile: { connect: { id: profileId } },
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: advert,
        message: 'advert created',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSingleAdvert() {}

  async updateAdvert() {}

  async deleteAdver() {}
}
