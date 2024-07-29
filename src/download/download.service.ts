import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class DownloadService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async downloadImage(imageId: string) {
    try {
      const imageDetails = await this.prisma.file.findFirst({
        where: { path: imageId },
      });

      if (!imageDetails) {
        throw new HttpException('Image does not exist', HttpStatus.NOT_FOUND);
      }

      const writer = fs.createWriteStream(`./` + imageDetails.title);

      const response = await await axios({
        url: imageDetails.path,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
