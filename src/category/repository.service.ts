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

  /**
   * get all available repositories
   * @returns : status code and list of repositories
   */
  async getAllAvailableRepositories() {
    try {
      const repositories = await this.prisma.category.findMany();
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
   * create a reposiroty
   * @param dto : create repository dto
   * @param userId : user id
   * @returns : status code and created repository
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
      if (user.role !== 'ADMIN') {
        throw new HttpException(
          'Only admins can create categories',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // create repository
      const repository = await this.prisma.category.create({
        data: { title: dto.name, description: dto.detail },
      });

      return { statusCode: HttpStatus.CREATED, data: repository };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * update repository information
   * @param dto : update repository dto
   * @param userId : user id
   * @param repositoryId : repository id
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
      if (user.role !== 'ADMIN') {
        throw new HttpException(
          'Only admins can update repositories',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // update repository
      const updatedRepository = await this.prisma.category.update({
        where: { id: repositoryId },
        data: { title: dto.name, description: dto.detail },
      });

      return { statusCode: HttpStatus.OK, data: updatedRepository };
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
   * @param repositoryId : id of repository
   * @param dto : pagination dto
   * @returns : current page, page size, total records, paginated response
   */
  async getAllArtInRepository(
    repositoryId: string,
    dto: PaginationDto,
  ): Promise<ApiResponse> {
    try {
      const skip = (dto.page - 1) * dto.pageSize;
      // check if repository exists
      const repositoryExists = await this.prisma.category.findFirst({
        where: { id: repositoryId },
      });
      if (!repositoryExists) {
        throw new HttpException(
          'Category does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      // find all artwork in the repository
      const results = await this.prisma.artWork.findMany({
        where: { categoryId: repositoryId },
        skip: skip,
      });

      // get length of result array
      const totalRecords = results.length;

      return {
        statusCode: HttpStatus.OK,
        data: {
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
   * @returns : status code and repository details
   */
  async getRepositoryDetails(repositoryId: string): Promise<ApiResponse> {
    try {
      // check if repository exists
      const repositoryExists = await this.prisma.category.findFirst({
        where: { id: repositoryId },
      });
      if (!repositoryExists) {
        throw new HttpException(
          'Category does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        data: repositoryExists,
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
