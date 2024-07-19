import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Type } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cloudinary: CloudinaryService,
  ) {}

  private async saveToFile(fileType: Type, title: string, path: string) {
    try {
      return await this.prisma.file.create({
        data: { fileType: fileType, title: title, path: path },
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cloudinaryUploadImage(
    uploadType: 'ProfilePicture' | 'Artwork' | 'Image',
    file: Express.Multer.File,
  ) {
    try {
      if (uploadType === 'Artwork') {
        // upload artwork
        const uploadedArtwork = await this.cloudinary.uploadImage(
          'Artwork',
          file,
        );

        const fileDetails = await this.saveToFile(
          'IMAGE',
          file.originalname,
          uploadedArtwork.url,
        );
        return {
          statusCode: HttpStatus.CREATED,
          fileDetails,
        };
      }

      // upload profile picture
      if (uploadType === 'ProfilePicture') {
        const uploadedProfilePicture = await this.cloudinary.uploadImage(
          'Profile',
          file,
        );

        const fileDetails = await this.saveToFile(
          'IMAGE',
          file.originalname,
          uploadedProfilePicture.url,
        );
        return {
          statusCode: HttpStatus.CREATED,
          fileDetails,
        };
      }

      // upload image
      if (uploadType === 'Image') {
        const uploadedImage = await this.cloudinary.uploadImage('Image', file);

        const fileDetails = await this.saveToFile(
          'IMAGE',
          file.originalname,
          uploadedImage.url,
        );
        return {
          statusCode: HttpStatus.CREATED,
          fileDetails,
        };
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cloudinaryUploadAudio(file: Express.Multer.File) {
    try {
      const uploadedAudio = await this.cloudinary.uploadOther('Audio', file);

      const fileDetails = await this.saveToFile(
        'AUDIO',
        file.originalname,
        uploadedAudio.url,
      );
      return {
        statusCode: HttpStatus.CREATED,
        fileDetails,
      };
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export enum UploadTypeEnum {
  ProfilePicture,
  Artwork,
  Image,
}
