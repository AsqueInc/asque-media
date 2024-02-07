import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PodcastDto } from './dto/podcast.dto';

@Injectable()
export class PodcastService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cloudinary: CloudinaryService,
  ) {}

  async createAudioPodcast(dto: PodcastDto, profileId: string) {
    try {
      const podcast = await this.prisma.podcast.create({
        data: {
          title: dto.title,
          description: dto.description,
          profileId: profileId,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: podcast,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createVideoPodcast(dto: PodcastDto, profileId: string) {
    try {
      const video = await this.prisma.podcast.create({
        data: {
          title: dto.title,
          description: dto.description,
          profileId: profileId,
          type: 'VIDEO',
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: video,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadPodcastAudio(podcastId: string, file: Express.Multer.File) {
    try {
      const uploadAudio = await this.cloudinary.uploadOther('Audio', file);

      await this.prisma.podcast.update({
        where: { id: podcastId },
        data: { uri: uploadAudio.url },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { data: 'Poscast saved' },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadVideo(videoId: string, file: Express.Multer.File) {
    try {
      const uploadVideo = await this.cloudinary.uploadOther('Video', file);

      await this.prisma.podcast.update({
        where: { id: videoId },
        data: { uri: uploadVideo.url },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { data: 'Vidoo saved' },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPodcastDetails(podcastId: string) {
    try {
      const podcast = await this.prisma.podcast.findFirst({
        where: { id: podcastId },
      });

      return {
        statusCode: HttpStatus.OK,
        message: podcast,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getVideoDetails(videoId: string) {
    try {
      const video = await this.prisma.podcast.findFirst({
        where: { id: videoId },
      });

      return {
        statusCode: HttpStatus.OK,
        message: video,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPodcastByProfile(profileId: string) {
    try {
      const podcasts = await this.prisma.podcast.findMany({
        where: { profileId: profileId },
      });

      return {
        statusCode: HttpStatus.OK,
        message: podcasts,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllVideosByProfile(profileId: string) {
    try {
      const videos = await this.prisma.podcast.findMany({
        where: { profileId: profileId },
      });

      return {
        statusCode: HttpStatus.OK,
        message: videos,
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
