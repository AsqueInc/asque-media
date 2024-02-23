import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async search(location: string, title: string) {
    try {
      if (location === 'artworks') {
        return {
          statusCode: HttpStatus.OK,
          data: await this.prisma.artWork.findMany({
            where: { title: title },
          }),
        };
      }
      if (location === 'stories') {
        return {
          statusCode: HttpStatus.OK,
          data: await this.prisma.story.findMany({
            where: { title: title },
          }),
        };
      }
      if (location === 'albums') {
        return {
          statusCode: HttpStatus.OK,
          data: await this.prisma.album.findMany({
            where: { title: title },
          }),
        };
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
