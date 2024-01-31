import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
  async uploadImage(
    type: 'Artwork' | 'Image',
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (type === 'Artwork') {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder: 'artwork',
            transformation: { width: 300, height: 300, crop: 'fill' },
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        toStream(file.buffer).pipe(upload);
      });
    }

    if (type === 'Image') {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder: 'image',
            transformation: { width: 300, height: 300, crop: 'fill' },
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

  async uploadProfilePicture(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'profile',
          transformation: { width: 170, height: 170, crop: 'fill' },
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadAudio(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'audio',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadVideo(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'video',
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

export enum ImageUploadType {
  ProfilePicture,
  Image,
}
