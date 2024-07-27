import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { ApiResponse } from 'src/types/response.type';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { AdvertPaginationDto } from './dto/advert-pagination-dto';

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
        message: 'Advert created',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSingleAdvert(advertId: string): Promise<ApiResponse> {
    try {
      const advert = await this.prisma.advert.findFirst({
        where: { id: advertId },
        select: {
          id: true,
          title: true,
          link: true,
          text: true,
          imageUris: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!advert) {
        throw new HttpException('Advert does not exist', HttpStatus.NOT_FOUND);
      }

      return { statusCode: HttpStatus.OK, data: advert };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Advert does not exist', HttpStatus.NOT_FOUND);
      }
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllAdverts(dto: AdvertPaginationDto): Promise<ApiResponse> {
    try {
      const totalRecords = await this.prisma.advert.count();
      const totalPages = Math.ceil(totalRecords / dto.pageSize);

      // randomize the page to return
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const skip = (randomPage - 1) * dto.pageSize;

      const adverts = await this.prisma.advert.findMany({
        skip: skip,
        take: dto.pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          link: true,
          text: true,
          imageUris: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: {
          adverts,
          pageSize: dto.pageSize,
          totalRecords: totalRecords,
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

  async updateAdvert(
    profileId: string,
    advertId: string,
    dto: UpdateAdvertDto,
  ): Promise<ApiResponse> {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { id: profileId },
        select: { user: { select: { role: true } } },
      });

      if (profile.user.role !== 'ADMIN') {
        throw new HttpException(
          'Only admins can update adverts',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const updatedAdvert = await this.prisma.advert.update({
        where: { id: advertId },
        data: { ...dto },
        select: {
          id: true,
          title: true,
          link: true,
          text: true,
          imageUris: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: { updatedAdvert },
        message: 'Advert updated',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Advert does not exist', HttpStatus.NOT_FOUND);
      }
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAdvert(
    profileId: string,
    advertId: string,
  ): Promise<ApiResponse> {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { id: profileId },
        select: { user: { select: { role: true } } },
      });

      if (profile.user.role !== 'ADMIN') {
        throw new HttpException(
          'Only admins can delete adverts',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.advert.delete({ where: { id: advertId } });

      return { statusCode: HttpStatus.OK, message: 'Advert deleted' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Advert does not exist', HttpStatus.NOT_FOUND);
      }
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
