import { Controller, Post, Param } from '@nestjs/common';
import { DownloadService } from './download.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('download-endpoint')
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Post('image/:imageId')
  @ApiOperation({ summary: 'Download an image ' })
  downloadImage(@Param('imageId') imageId: string) {
    return this.downloadService.downloadImage(imageId);
  }
}
