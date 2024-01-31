import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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

  async cloudinaryUpload(
    uploadType: 'ProfilePicture' | 'Artwork' | 'Audio' | 'Video' | 'Image',
    file: Express.Multer.File,
  ) {
    try {
      if (uploadType === 'Artwork') {
        const uploadedArtwork = await this.cloudinary.uploadImage(
          'Artwork',
          file,
        );
        return {
          artworkUri: uploadedArtwork.url,
          artworkName: uploadedArtwork.name,
        };
      }
      if (uploadType === 'ProfilePicture') {
        const uploadedArtwork =
          await this.cloudinary.uploadProfilePicture(file);
        return {
          artworkUri: uploadedArtwork.url,
          artworkName: uploadedArtwork.name,
        };
      }
      if (uploadType === 'Audio') {
        const uploadedArtwork = await this.cloudinary.uploadAudio(file);
        return {
          artworkUri: uploadedArtwork.url,
          artworkName: uploadedArtwork.name,
        };
      }
      if (uploadType === 'Video') {
        const uploadedArtwork = await this.cloudinary.uploadVideo(file);
        return {
          artworkUri: uploadedArtwork.url,
          artworkName: uploadedArtwork.name,
        };
      }
      if (uploadType === 'Image') {
        const uploadedArtwork = await this.cloudinary.uploadVideo(file);
        return {
          artworkUri: uploadedArtwork.url,
          artworkName: uploadedArtwork.name,
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
}

export enum UploadTypeEnum {
  ProfilePicture,
  Artwork,
  Audio,
  Video,
  Image,
}
