import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/types/response.type';
import { Logger } from 'winston';
import { CreateAlbumDto } from './dto/create-album.dto';
import { DeleteAlbumImageDto } from './dto/delete-album-image.dto';
import { CreateStockImageDto } from './dto/create-stock-image.dto';

@Injectable()
export class AlbumService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cloudinary: CloudinaryService,
  ) {}

  /**
   * get details of an album via album id
   * @param albumId : id of album
   * @returns : status code and album details
   */
  async getAlbumDetailsById(albumId: string): Promise<ApiResponse> {
    try {
      const album = await this.prisma.album.findFirst({
        where: { id: albumId },
        include: { profile: { select: { name: true } } },
      });

      if (!album) {
        throw new HttpException('Album does not exist', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        data: { album },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllAlbums(dto: PaginationDto): Promise<ApiResponse> {
    try {
      const totalRecords = await this.prisma.album.count();

      const skip = (dto.page - 1) * dto.pageSize;

      const albums = await this.prisma.album.findMany({
        skip: skip,
        take: Number(dto.pageSize),
        orderBy: { createdAt: 'desc' },
      });

      return {
        statusCode: HttpStatus.OK,
        data: {
          currentPage: dto.page,
          pageSize: dto.pageSize,
          totalRecord: totalRecords,
          data: albums,
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

  /**
   * get all albums posted by a profile via profile id
   * @param profileId : id of profile
   * @param dto : paginationDto
   * @returns : status code and list of albums
   */
  async getAllAlbumsByProfileId(
    profileId: string,
    dto: PaginationDto,
  ): Promise<ApiResponse> {
    try {
      const totalRecords = await this.prisma.album.count({
        where: { profileId: profileId },
      });
      const skip = (dto.page - 1) * dto.pageSize;

      const albums = await this.prisma.album.findMany({
        where: { profileId: profileId },
        include: { profile: { select: { name: true, briefBio: true } } },
        skip: skip,
        take: Number(dto.pageSize),
      });

      return {
        statusCode: HttpStatus.OK,
        data: {
          currentPage: dto.page,
          pageSize: dto.pageSize,
          totalRecord: totalRecords,
          data: albums,
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

  /**
   * delete an album by id
   * @param albumId : id of album
   * @param profileId : id of profile
   * @returns : status code and message
   */
  async deleteAlbum(albumId: string, profileId: string): Promise<ApiResponse> {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { id: profileId },
        include: { user: { select: { role: true } } },
      });

      const album = await this.prisma.album.findFirst({
        where: { id: albumId },
      });

      if (!album) {
        throw new HttpException('Album does not exist', HttpStatus.NOT_FOUND);
      }

      // ensure only owner of album can delete album
      if (album.profileId !== profileId && profile.user.role !== 'ADMIN') {
        throw new HttpException(
          'You cannot delete an album that you did not create',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.album.delete({ where: { id: albumId } });

      return {
        statusCode: HttpStatus.OK,
        message: 'Album deleted',
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
   * create an album
   * @param dto : create album dto
   * @returns : status code and album details
   */
  async createAlbum(
    dto: CreateAlbumDto,
    profileId: string,
  ): Promise<ApiResponse> {
    try {
      const album = await this.prisma.album.create({
        data: {
          title: dto.title,
          category: dto.category,
          subTitle: dto.subTitle,
          description: dto.description,
          albumImageUris: dto.albumImageUris,
          profile: {
            connect: {
              id: profileId,
            },
          },
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: album,
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
   * delete an album image
   * @param albumId : album id
   * @param profileId : profile id
   * @param dto : delete album image dto
   */
  async deleteAlbumImage(
    albumId: string,
    profileId: string,
    dto: DeleteAlbumImageDto,
  ): Promise<ApiResponse> {
    const album = await this.prisma.album.findFirst({
      where: { id: albumId },
    });

    if (!album) {
      throw new HttpException('Album does not exist', HttpStatus.NOT_FOUND);
    }

    // ensure only owner of album can delete album
    if (album.profileId !== profileId) {
      throw new HttpException(
        'You cannot delete images to an album you did not create',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // remove image uri from list
    const albumImageUriList = album.albumImageUris;
    const indexToRemove = albumImageUriList.indexOf(dto.imageUri);

    if (indexToRemove !== -1) {
      albumImageUriList.splice(indexToRemove, 1);
    }

    await this.prisma.album.update({
      where: { id: albumId },
      data: { albumImageUris: albumImageUriList },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Image removed from list',
    };
  }

  async getAllAlbumsInACategory(categoryName: string, dto: PaginationDto) {
    try {
      const totalRecords = await this.prisma.album.count({
        where: { category: { has: categoryName } },
      });

      const skip = (dto.page - 1) * dto.pageSize;

      const albums = await this.prisma.album.findMany({
        where: { category: { has: categoryName } },
        skip: skip,
        take: Number(dto.pageSize),
      });

      return {
        statusCode: HttpStatus.OK,
        data: {
          currentPage: dto.page,
          pageSize: dto.pageSize,
          totalRecord: totalRecords,
          data: albums,
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

  async getNewestAlbums() {
    try {
      const albums = await this.prisma.album.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      return { statusCode: HttpStatus.OK, data: albums };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createStockImage(dto: CreateStockImageDto) {
    try {
      const stockImage = await this.prisma.stockImage.create({
        data: {
          stockImageUrl: dto.imageUrl,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: stockImage,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllStockImages(dto: PaginationDto) {
    try {
      const totalRecords = await this.prisma.stockImage.count();

      const skip = (dto.page - 1) * dto.pageSize;

      const stockImages = await this.prisma.stockImage.findMany({
        skip: skip,
        take: Number(dto.pageSize),
        orderBy: { createdAt: 'desc' },
      });

      return {
        statusCode: HttpStatus.OK,
        data: {
          currentPage: dto.page,
          pageSize: dto.pageSize,
          totalRecord: totalRecords,
          data: stockImages,
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
