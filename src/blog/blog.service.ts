import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createBlog(dto: CreateBlogDto) {
    try {
      const blog = await this.prisma.blog.create({
        data: {
          title: dto.title,
          content: dto.content,
          user: {
            connect: {
              id: dto.userId,
            },
          },
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: { blog },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUserBlogs(userId: string) {
    try {
      const blogs = await this.prisma.blog.findMany({
        where: { userId: userId },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { blogs },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSingleBlog(blogId: string) {
    try {
      const blog = await this.prisma.blog.findFirst({ where: { id: blogId } });
      if (!blog) {
        throw new HttpException('Blog does not exists', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: { blog },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBlog(userId: string, blogId: string) {
    try {
      const blog = await this.prisma.blog.findFirst({ where: { id: blogId } });
      if (!blog) {
        throw new HttpException('Blog does not exists', HttpStatus.NOT_FOUND);
      }

      const user = await this.prisma.user.findFirst({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      if (blog.userId !== userId) {
        throw new HttpException(
          'You cannot delete a blog that you did not write',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.blog.delete({ where: { id: blogId } });

      return {
        statusCode: HttpStatus.OK,
        message: { message: 'Blog deleted' },
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBlog(userId: string, blogId: string, dto: UpdateBlogDto) {
    try {
      const blog = await this.prisma.blog.findFirst({ where: { id: blogId } });
      if (!blog) {
        throw new HttpException('Blog does not exists', HttpStatus.NOT_FOUND);
      }

      const user = await this.prisma.user.findFirst({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      if (blog.userId !== userId) {
        throw new HttpException(
          'You cannot update a blog that you did not write',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const updatedBlog = await this.prisma.blog.update({
        where: { id: blogId },
        data: {
          title: dto.title,
          content: dto.content,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: { updatedBlog },
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
