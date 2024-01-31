import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('cloudinary:uploadType')
  @ApiParam({
    name: 'type',
    enum: ['ProfilePicture', 'Artwork', 'Audio', 'Video', 'Image'],
  })
  @ApiOperation({ summary: 'Upload media via cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  cloudinaryUpload(
    file: Express.Multer.File,
    @Param('type')
    type: 'ProfilePicture' | 'Artwork' | 'Audio' | 'Video' | 'Image',
  ) {
    return this.uploadService.cloudinaryUpload(type, file);
  }
}
