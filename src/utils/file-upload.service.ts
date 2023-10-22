import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as cloudinary from 'cloudinary';

@Injectable()
export class FileUploadService {
  constructor(
    private config: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    cloudinary.v2.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadPicture(file: Express.Multer.File, uploadType: ImageUploadType) {
    try {
      if (file.size > 3000000) {
        throw new Error('Please upload a file that is not more than 3MB');
      }

      if (!file.mimetype.startsWith('image')) {
        throw new Error('You can only upload images');
      }

      if (uploadType === ImageUploadType.ProfilePicture) {
        const uploadedFile = await cloudinary.v2.uploader.upload(file.path, {
          folder: 'uploads/profile-picture', // Set the folder in Cloudinary where the file will be stored
          transformation: [{ height: 170, width: 170 }, { radius: 20 }],
        });

        this.logger.info(uploadedFile.public_id);
        return { imagePublicId: uploadedFile.public_id };
      }

      if (uploadType === ImageUploadType.Image) {
        const uploadedFile = await cloudinary.v2.uploader.upload(file.path, {
          folder: 'uploads/images', // Set the folder in Cloudinary where the file will be stored
          transformation: [{ height: 300, width: 300 }],
        });

        // remove log after testing
        this.logger.info(uploadedFile.public_id);
        return { imagePublicId: uploadedFile.public_id };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export enum ImageUploadType {
  ProfilePicture,
  Image,
}
