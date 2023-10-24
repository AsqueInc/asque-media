import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/types/response.type';
import { Logger } from 'winston';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createReview(dto: CreateReviewDto): Promise<ApiResponse> {
    try {
      const review = await this.prisma.review.create({
        data: {
          comment: dto.comment,
          artworkId: dto.artworkId,
          profileId: dto.profileId,
          rating: dto.rating,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: { review },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllArtworkReviews(
    artworkId: string,
    dto: PaginationDto,
  ): Promise<ApiResponse> {
    try {
      const skip = (dto.page - 1) * dto.pageSize;

      const reviews = await this.prisma.review.findMany({
        where: { artworkId: artworkId },
        skip: skip,
      });

      // get length of result array
      const totalRecords = reviews.length;

      return {
        statusCode: HttpStatus.OK,
        message: {
          currentPage: dto.page,
          pageSize: dto.pageSize,
          totalRecord: totalRecords,
          data: reviews,
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

  async getSingleReview(reiewId: string) {
    try {
      const review = await this.prisma.review.findFirst({
        where: { id: reiewId },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { review },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateReview(
    reviewId: string,
    profileId: string,
    dto: UpdateReviewDto,
  ) {
    try {
      const review = await this.prisma.review.findFirst({
        where: { id: reviewId },
      });

      if (review.profileId !== profileId) {
        throw new HttpException(
          'You cannot update a review you did not write',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const updatedReview = await this.prisma.review.update({
        where: { id: reviewId },
        data: { comment: dto.comment, rating: dto.rating },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { updatedReview },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteReview(
    reviewId: string,
    profileId: string,
  ): Promise<ApiResponse> {
    try {
      const review = await this.prisma.review.findFirst({
        where: { id: reviewId },
      });

      if (review.profileId !== profileId) {
        throw new HttpException(
          'You cannot delete a review you did not write',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.review.delete({ where: { id: reviewId } });

      return {
        statusCode: HttpStatus.OK,
        message: { data: 'Review deleted' },
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
