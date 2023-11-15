import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/types/response.type';
import { Logger } from 'winston';
import { CreateAlbumDto } from './dto/create-album.dto';

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
        include: { artwork: true },
      });

      if (!album) {
        throw new HttpException('Album does not exist', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: { album },
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
   * get details of an album via artwork id
   * @param artWorkId : artworkId of album
   * @returns : status code and album details
   */
  async getAlbumDetailsByArtworkId(artWorkId: string): Promise<ApiResponse> {
    try {
      const album = await this.prisma.album.findFirst({
        where: { artworkId: artWorkId },
        include: { artwork: true },
      });

      if (!album) {
        throw new HttpException(
          'An album has not been created for this artwork',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: { album },
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
      const skip = (dto.page - 1) * dto.pageSize;

      const albums = await this.prisma.album.findMany({
        where: { profileId: profileId },
        include: { profile: true, artwork: true },
        skip: skip,
      });

      // get length of result array
      const totalRecords = albums.length;

      return {
        statusCode: HttpStatus.OK,
        message: {
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
      const album = await this.prisma.album.findFirst({
        where: { id: albumId },
      });

      if (!album) {
        throw new HttpException('Album does not exist', HttpStatus.NOT_FOUND);
      }

      // ensure only owner of album can delete album
      if (album.profileId !== profileId) {
        throw new HttpException(
          'You cannot delete an album you did not create',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.album.delete({ where: { id: albumId } });

      return {
        statusCode: HttpStatus.OK,
        message: { message: 'Album deleted' },
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
  async createAlbum(dto: CreateAlbumDto): Promise<ApiResponse> {
    try {
      const artwork = await this.prisma.artWork.findFirst({
        where: { id: dto.artworkId },
      });

      if (!artwork) {
        throw new HttpException('Artwork does not exist', HttpStatus.NOT_FOUND);
      }

      if (artwork.artistProfileId !== dto.profileId) {
        throw new HttpException(
          'Only the owner of an artwork can create an album',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const album = await this.prisma.album.create({
        data: { artworkId: dto.artworkId, profileId: dto.profileId },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: { album },
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
   * upload an image to an album
   * @param albumId : album id
   * @param profileId : profile id
   * @param file : file to be uploaded
   * @returns : status code and updated album
   */
  async uploadImageToAlbum(
    albumId: string,
    profileId: string,
    file: Express.Multer.File,
  ): Promise<ApiResponse> {
    try {
      const album = await this.prisma.album.findFirst({
        where: { id: albumId },
      });

      if (!album) {
        throw new HttpException('Album does not exist', HttpStatus.NOT_FOUND);
      }

      // ensure only owner of album can delete album
      if (album.profileId !== profileId) {
        throw new HttpException(
          'You cannot upload an image to an album you did not create',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // ensure an album does not have more than 20 images
      if (album.albumImageUris.length === 20) {
        throw new HttpException(
          'You cannot upload more than 20 images to an album',
          HttpStatus.BAD_REQUEST,
        );
      }
      // upload image to cloudinary
      const uploadedImageUri = await this.cloudinary.uploadImage(file);

      //   album.albumImageUris.push(uploadedImageUri.url);

      // update album
      const updatedAlbum = await this.prisma.album.update({
        where: { id: albumId },
        data: { albumImageUris: uploadedImageUri.url },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { updatedAlbum },
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
   * replace an image in an album
   * @param albumId : album id
   * @param profileId : profile id
   * @param imageNumber : image number to be replaced
   * @param file : image to be replaced with
   */
  async replaceImage(
    albumId: string,
    profileId: string,
    imageNumber: number,
    file: Express.Multer.File,
  ): Promise<ApiResponse> {
    try {
      const album = await this.prisma.album.findFirst({
        where: { id: albumId },
      });

      if (!album) {
        throw new HttpException('Album does not exist', HttpStatus.NOT_FOUND);
      }

      // ensure only owner of album can delete album
      if (album.profileId !== profileId) {
        throw new HttpException(
          'You cannot replace images to an album you did not create',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: { imageNumber, file },
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
   * @param imageNumber : image number to be replaced
   * @param file : image to be replaced with
   */
  async deleteAlbumImage(
    albumId: string,
    profileId: string,
    imageNumber: number,
    file: Express.Multer.File,
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

    return {
      statusCode: HttpStatus.OK,
      message: { imageNumber, file },
    };
  }
}
