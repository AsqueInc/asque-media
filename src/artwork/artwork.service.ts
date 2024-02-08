import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/types/response.type';
import { Logger } from 'winston';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ArtworkService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cloudinary: CloudinaryService,
  ) {}

  /**
   * create an artwork
   * @param dto : create artwork dto
   * @returns : status code and artork object
   */
  async createArtwork(
    dto: CreateArtworkDto,
    profileId: string,
  ): Promise<ApiResponse> {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { id: profileId },
        include: { user: { select: { role: true } } },
      });

      if (profile.user.role !== 'ARTIST') {
        throw new HttpException(
          'Only artists can create artwork',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const category = await this.prisma.category.findFirst({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new HttpException(
          'Category does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const artwork = await this.prisma.artWork.create({
        data: {
          title: dto.title,
          artistProfile: {
            connect: {
              id: profileId,
            },
          },
          description: dto.description,
          price: dto.price,
          saleType: dto.saleType,
          quantity: dto.saleType == 'ORIGINAL' ? 0 : dto.quantity,
          imageUris: dto.imageUris,
          category: { connect: { id: category.id } },
          // categoryId: category.id,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: artwork,
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
   * update an artwork
   * @param artworkId : id of artwork
   * @param profileId : id of profile
   * @param dto : update artwork dto
   * @returns : status code and updated artwork
   */
  async updateArtWork(
    artworkId: string,
    profileId: string,
    dto: UpdateArtworkDto,
  ): Promise<ApiResponse> {
    try {
      const artwork = await this.prisma.artWork.findFirst({
        where: { id: artworkId },
      });

      if (artwork.artistProfileId !== profileId) {
        throw new HttpException(
          'You cannot update an artwork you do not own',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const updatedArtWork = await this.prisma.artWork.update({
        where: { id: artworkId },
        data: {
          title: dto.title,
          description: dto.description,
          price: dto.price,
          category: { connect: { id: dto.categoryId } },
          // category: { connectOrCreate: { create: { id: dto.categoryId } } },
        },
      });
      return {
        statusCode: HttpStatus.OK,
        data: updatedArtWork,
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
   * get an artwork by artwork id
   * @param artworkId : id of artwork
   * @returns : status code and artwork object
   */
  async getSingleArtWorkById(artworkId: string): Promise<ApiResponse> {
    try {
      const artWork = await this.prisma.artWork.findFirst({
        where: { id: artworkId },
      });

      if (!artWork) {
        throw new HttpException('Artwork not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        data: artWork,
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
   * get all artwork created by a user
   * @param profileId : id of artist
   * @param dto : pagination dto
   * @returns : status code and list of artworks by a profile
   */
  async getAllArtworkByUser(
    profileId: string,
    dto: PaginationDto,
  ): Promise<ApiResponse> {
    try {
      const skip = (dto.page - 1) * dto.pageSize;

      const userArtworks = await this.prisma.artWork.findMany({
        where: { artistProfileId: profileId },
        skip: skip,
      });

      const totalRecords = userArtworks.length;

      return {
        statusCode: HttpStatus.OK,
        data: {
          currentPage: dto.page,
          pageSize: dto.pageSize,
          totalRecord: totalRecords,
          data: userArtworks,
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
}
