import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/types/response.type';
import { Logger } from 'winston';
import { CreateAlbumDto } from './dto/create-album.dto';
import { DeleteAlbumImageDto } from './dto/delete-album-image.dto';

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
        include: {
          profile: { select: { name: true } },
          albumChildren: { select: { albumImageUris: true } },
        },
      });

      if (!album) {
        throw new HttpException('Album does not exist', HttpStatus.NOT_FOUND);
      }

      if (
        album.albumImageUris.length < 1 &&
        album.albumChildren.length > 0 &&
        album.albumChildren[0].albumImageUris.length > 0
      ) {
        // if there is no image in the main album, take the first image in the first album children and add
        album.albumImageUris.push(album.albumChildren[0].albumImageUris[0]);
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
        include: { albumChildren: { select: { albumImageUris: true } } },
      });

      // if there is no image in the main album, take the first image in the first album children and add
      for (const album of albums) {
        if (
          album.albumImageUris.length < 1 &&
          album.albumChildren.length > 0 &&
          album.albumChildren[0].albumImageUris.length > 0
        ) {
          album.albumImageUris.push(album.albumChildren[0].albumImageUris[0]);
        }
      }

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
        include: {
          profile: { select: { name: true, briefBio: true } },
          albumChildren: { select: { albumImageUris: true } },
        },
        skip: skip,
        take: Number(dto.pageSize),
      });

      // if there is no image in the main album, take the first image in the first album children and add
      for (const album of albums) {
        if (
          album.albumImageUris.length < 1 &&
          album.albumChildren.length > 0 &&
          album.albumChildren[0].albumImageUris.length > 0
        ) {
          album.albumImageUris.push(album.albumChildren[0].albumImageUris[0]);
        }
      }

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

      // return this if there are no album children
      if (dto.albumChildren === undefined) {
        return {
          statusCode: HttpStatus.CREATED,
          data: { album },
        };
      }

      const albumChildrenArray = [];

      // create sub albums
      for (const albumChildren of dto.albumChildren) {
        const albumChild = await this.prisma.albumChildren.create({
          data: {
            subTitle: albumChildren.subTitle,
            description: albumChildren.description,
            category: albumChildren.category,
            albumImageUris: albumChildren.albumImageUris,
            album: { connect: { id: album.id } },
          },
        });

        albumChildrenArray.push(albumChild);
      }

      return {
        statusCode: HttpStatus.CREATED,
        data: { album, albumChildrenArray },
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
        include: { albumChildren: { select: { albumImageUris: true } } },
      });

      // if there is no image in the main album, take the first image in the first album children and add
      for (const album of albums) {
        if (
          album.albumImageUris.length < 1 &&
          album.albumChildren.length > 0 &&
          album.albumChildren[0].albumImageUris.length > 0
        ) {
          album.albumImageUris.push(album.albumChildren[0].albumImageUris[0]);
        }
      }
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
        include: { albumChildren: { select: { albumImageUris: true } } },
      });

      // if there is no image in the main album, take the first image in the first album children and add
      for (const album of albums) {
        if (
          album.albumImageUris.length < 1 &&
          album.albumChildren.length > 0 &&
          album.albumChildren[0].albumImageUris.length > 0
        ) {
          album.albumImageUris.push(album.albumChildren[0].albumImageUris[0]);
        }
      }

      return { statusCode: HttpStatus.OK, data: albums };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // cache this later on
  async getAllStockImages() {
    try {
      const stockImageUrls = [];

      const albums = await this.prisma.album.findMany();

      // save the first image in every album
      for (const album of albums) {
        stockImageUrls.push(album.albumImageUris);
      }

      return {
        statusCode: HttpStatus.OK,
        data: {
          stockImageUrls,
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
