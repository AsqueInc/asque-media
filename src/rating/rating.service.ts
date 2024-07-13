import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { RateItemDto } from './dto/rate-item.dto';
import { ApiResponse } from 'src/types/response.type';

@Injectable()
export class RatingService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async updateLikeCount(
    itemId: string,
    itemType: 'ALBUM' | 'ARTWORK' | 'BLOG',
  ) {
    if (itemType === 'ARTWORK') {
      const artwork = await this.prisma.artWork.findFirst({
        where: { id: itemId },
      });

      const newLikeCount = artwork.numberOfLikes + 1;

      // update artwork like count
      const updatedArtwork = await this.prisma.artWork.update({
        where: { id: itemId },
        data: { numberOfLikes: newLikeCount },
      });

      return updatedArtwork;
    }
    if (itemType === 'ALBUM') {
      const album = await this.prisma.album.findFirst({
        where: { id: itemId },
      });

      const newLikeCount = album.numberOfLikes + 1;

      // update album like count
      const updatedAlbum = await this.prisma.album.update({
        where: { id: itemId },
        data: { numberOfLikes: newLikeCount },
      });

      return updatedAlbum;
    }
    if (itemType === 'BLOG') {
      const blog = await this.prisma.story.findFirst({
        where: { id: itemId },
      });

      const newLikeCount = blog.numberOfLikes + 1;

      // update blog like count
      const updatedBlog = await this.prisma.story.update({
        where: { id: itemId },
        data: { numberOfLikes: newLikeCount },
      });

      return updatedBlog;
    }

    return;
  }

  /**
   * rate an album, artwork or story
   * @param profileId : id of the user
   * @param dto : rate item dto with itemId and itemType fields
   * @returns : status code and data
   */
  async rateItem(profileId: string, dto: RateItemDto): Promise<ApiResponse> {
    try {
      // check item type
      const validItemTypes = ['ALBUM', 'ARTWORK', 'BLOG'];
      if (!validItemTypes.includes(dto.itemType)) {
        throw new HttpException('Incorrect item type', HttpStatus.BAD_REQUEST);
      }

      // ensure user has not like an item before
      const isItemAlreadyLiked = await this.prisma.like.findFirst({
        where: {
          profileId: profileId,
          itemId: dto.itemId,
          itemType: dto.itemType,
        },
      });
      if (isItemAlreadyLiked) {
        throw new HttpException(
          'You cannot like an item more than once',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const likeDetails = await this.prisma.like.create({
        data: {
          itemId: dto.itemId,
          itemType: dto.itemType,
          profile: { connect: { id: profileId } },
        },
      });

      const updatedItemDetails = await this.updateLikeCount(
        dto.itemId,
        dto.itemType,
      );

      return {
        statusCode: HttpStatus.OK,
        data: {
          likeDetails: likeDetails,
          updatedItemDetails: updatedItemDetails,
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
}
