import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Logger } from 'winston';

@Injectable()
export class AwsImageUploadService {
  constructor(
    private readonly configService: ConfigService,
    private logger: Logger,
  ) {}

  /**
   * upload an image to aws s3
   * @param file : image to be uploaded
   * @returns : upload result data
   */
  async uploadImage(file: Express.Multer.File) {
    try {
      const s3 = new S3({
        credentials: {
          accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
          secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
        },
        region: this.configService.get('AWS_S3_REGION'),
      });

      // create params object that would be used to upload the image to the s3 bucket
      const params = S3.PutObjectRequest = {
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read',
      };

      // upload image
      const response = await s3.upload(params).promise();

      return response;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
