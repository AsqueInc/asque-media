import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/category/dto/pagination.dto';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cloudinary: CloudinaryService,
  ) {}

  async createBlog(dto: CreateBlogDto, profileId: string) {
    try {
      const blog = await this.prisma.story.create({
        data: {
          title: dto.title,
          content: dto.content,
          profile: {
            connect: {
              id: profileId,
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

  async getAllUserBlogs(profileId: string, dto: PaginationDto) {
    try {
      const skip = (dto.page - 1) * dto.pageSize;

      const blogs = await this.prisma.story.findMany({
        where: { profileId: profileId },
        skip: skip,
      });

      const totalRecords = blogs.length;

      return {
        statusCode: HttpStatus.OK,
        data: {
          blogs,
          pageSize: dto.pageSize,
          currentPage: dto.page,
          totalRecord: totalRecords,
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

  async getSingleBlog(blogId: string) {
    try {
      const blog = await this.prisma.story.findFirst({
        where: { id: blogId },
        include: { profile: { select: { name: true } } },
      });
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

  async deleteBlog(profileId: string, blogId: string) {
    try {
      const blog = await this.prisma.story.findFirst({ where: { id: blogId } });
      if (!blog) {
        throw new HttpException('Blog does not exists', HttpStatus.NOT_FOUND);
      }

      const profile = await this.prisma.profile.findFirst({
        where: { id: profileId },
      });
      if (!profile) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      if (blog.profileId !== profileId) {
        throw new HttpException(
          'You cannot delete a blog that you did not write',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.prisma.story.delete({ where: { id: blogId } });

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

  async updateBlog(profileId: string, blogId: string, dto: UpdateBlogDto) {
    try {
      const blog = await this.prisma.story.findFirst({ where: { id: blogId } });
      if (!blog) {
        throw new HttpException('Blog does not exists', HttpStatus.NOT_FOUND);
      }

      const profile = await this.prisma.profile.findFirst({
        where: { id: profileId },
      });
      if (!profile) {
        throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
      }

      if (blog.profileId !== profileId) {
        throw new HttpException(
          'You cannot update a blog that you did not write',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const updatedBlog = await this.prisma.story.update({
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

  async addImageToBlog(
    blogId: string,
    profileId: string,
    file: Express.Multer.File,
  ) {
    try {
      const blog = await this.prisma.story.findFirst({ where: { id: blogId } });
      if (!blog) {
        throw new HttpException('Blog does not exists', HttpStatus.NOT_FOUND);
      }

      if (blog.profileId !== profileId) {
        throw new HttpException(
          'You cannot upload an image to an blog you did not write',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const blogImageUriList = blog.imageUris;
      const uploadedImageUri = await this.cloudinary.uploadImage(file);
      blogImageUriList.push(uploadedImageUri.url);

      const updatedBlog = await this.prisma.story.update({
        where: { id: blogId },
        data: { imageUris: blogImageUriList },
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
