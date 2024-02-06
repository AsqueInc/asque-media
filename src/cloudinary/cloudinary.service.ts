import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  /**
   * cloudinary upload helper function
   * @param type : type of file to upload i.e image or other
   * @param folderName : folder where file is to be saved
   * @param file : file object
   * @param width : image width
   * @param height : image heigh
   * @param crop : crop type
   * @returns : error or upload result
   */
  private async uploadHelper(
    type: 'image' | 'other',
    folderName: string,
    file: Express.Multer.File,
    width?: number,
    height?: number,
    crop?: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (type === 'image') {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder: folderName,
            transformation: { width: width, height: height, crop: crop },
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(upload);
      });
    }

    if (type === 'other') {
      return await new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder: folderName,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(upload);
      });
    }
  }

  /**
   * function to upload images
   * @param type : image type i.e artwork, image or profile
   * @param file : file object
   * @returns : error or result
   */
  async uploadImage(
    type: 'Artwork' | 'Image' | 'Profile',
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (type === 'Artwork') {
      return await this.uploadHelper(
        'image',
        'artwork',
        file,
        300,
        300,
        'fill',
      );
    }

    if (type === 'Image') {
      return await this.uploadHelper('image', 'image', file, 300, 300, 'fill');
    }

    if (type === 'Profile') {
      return await this.uploadHelper(
        'image',
        'profile',
        file,
        170,
        170,
        'fill',
      );
    }
  }

  async uploadOther(
    type: 'Audio' | 'Video',
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (type === 'Audio') {
      return await this.uploadHelper('other', 'audio', file);
    }
    if (type === 'Video') {
      return await this.uploadHelper('other', 'video', file);
    }
  }
}

export enum ImageUploadType {
  ProfilePicture,
  Image,
}
