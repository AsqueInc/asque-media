import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { ApiResponse } from 'src/types/response.type';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class RepositoryService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly emailService: EmailNotificationService,
  ) {}

  async getAllAvailableRepositories() {
    try {
      const repositories = await this.prisma.repository.findMany();
      return {
        statusCode: HttpStatus.OK,
        message: { data: repositories },
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
   * create a category
   * @param dto : crete category dto
   * @param userId : user id
   * @returns : status code and created category
   */
  async createRepository(
    dto: CreateRepositoryDto,
    userId: string,
  ): Promise<ApiResponse> {
    try {
      // check if user is an admin
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });
      if (user.isAdmin !== true) {
        throw new HttpException(
          'Only admins can create categories',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // create category
      const category = await this.prisma.repository.create({
        data: { title: dto.name, description: dto.detail },
      });

      return { statusCode: HttpStatus.CREATED, message: { category } };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * update category information
   * @param dto : update category dto
   * @param userId : user id
   * @param categoryId : category id
   * @returns status code and message
   */
  async updateRepository(
    dto: UpdateRepositoryDto,
    userId: string,
    repositoryId: string,
  ): Promise<ApiResponse> {
    try {
      // check if user is an admin
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });
      if (user.isAdmin !== true) {
        throw new HttpException(
          'Only admins can update repositories',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // update category
      const updatedRepository = await this.prisma.repository.update({
        where: { id: repositoryId },
        data: { title: dto.name, description: dto.detail },
      });

      return { statusCode: HttpStatus.OK, message: { updatedRepository } };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @param categoryId : id of category
   * @param dto : pagination dto
   * @returns current page, page size, total records, paginated response
   */
  async getAllArtInRepository(
    repositoryId: string,
    dto: PaginationDto,
  ): Promise<ApiResponse> {
    try {
      const skip = (dto.page - 1) * dto.pageSize;
      // check if category exists
      const categoryExists = await this.prisma.repository.findFirst({
        where: { id: repositoryId },
      });
      if (!categoryExists) {
        throw new HttpException(
          'Category does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      // find all artwork in the category
      const results = await this.prisma.artWork_Category.findMany({
        where: { category_id: repositoryId },
        skip: skip,
      });

      // get length of result array
      const totalRecords = results.length;

      return {
        statusCode: HttpStatus.OK,
        message: {
          currentPage: dto.page,
          pageSize: dto.pageSize,
          totalRecord: totalRecords,
          data: results,
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
   *
   * @param repositoryId : repository id
   * @returns : status code and category details
   */
  async getRepositoryDetails(repositoryId: string): Promise<ApiResponse> {
    try {
      // check if category exists
      const categoryExists = await this.prisma.repository.findFirst({
        where: { id: repositoryId },
      });
      if (!categoryExists) {
        throw new HttpException(
          'Category does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: { categoryExists },
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
