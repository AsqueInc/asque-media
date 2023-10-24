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

  async createArtwork(dto: CreateArtworkDto): Promise<ApiResponse> {
    try {
      const artwork = await this.prisma.artWork.create({
        data: {
          title: dto.title,
          description: dto.description,
          quantity: dto.quantity,
          price: dto.price,
          artistProfileId: dto.artistProfileId,
          artistName: dto.fullName,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: { artwork },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
          quantity: dto.quantity,
          artistName: dto.artistFullName,
          price: dto.price,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: { updatedArtWork },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSingleArtWorkById(artworkId: string): Promise<ApiResponse> {
    try {
      const artWork = await this.prisma.artWork.findFirst({
        where: { id: artworkId },
      });

      if (!artWork) {
        throw new HttpException(
          'Artwork does not have any published artwork',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: { artWork },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
        message: {
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

  async addArtworkToRepository(
    artworkId: string,
    profileId: string,
    repositoryId: string,
  ) {
    try {
      // check is user owns the artwork
      const artWork = await this.prisma.artWork.findFirst({
        where: { id: artworkId },
      });

      if (artWork.artistProfileId !== profileId) {
        throw new HttpException(
          'You can only add an artwork you own to a repository',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.artWork_Category.create({
        data: { artwork_id: artworkId, category_id: repositoryId },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: { data: 'Artwork added to repository' },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadArtWorkImage(
    profileId: string,
    artworkId: string,
    artworkNumber: number,
    file: Express.Multer.File,
  ) {
    try {
      // check is user owns the artwork
      const artWork = await this.prisma.artWork.findFirst({
        where: { id: artworkId },
      });
      if (artWork.artistProfileId !== profileId) {
        throw new HttpException(
          'You cannot upload images to a profile you do not own',
          HttpStatus.UNAUTHORIZED,
        );
      }
      // upload image of artwork
      const uploadedImage = await this.cloudinary.uploadImage(file);

      // save image public id to database
      if (artworkNumber === 1) {
        await this.prisma.artWork.update({
          where: { id: artworkId },
          data: { firstImageUri: uploadedImage.url },
        });
      } else if (artworkNumber === 2) {
        await this.prisma.artWork.update({
          where: { id: artworkId },
          data: { secondImageUri: uploadedImage.url },
        });
      } else {
        await this.prisma.artWork.update({
          where: { id: artworkId },
          data: { thirdImageUri: uploadedImage.url },
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: { data: 'Artwork images added' },
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
