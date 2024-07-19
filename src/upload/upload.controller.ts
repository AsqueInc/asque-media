import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('upload-endpoints')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('cloudinary/:type')
  @ApiParam({
    name: 'type',
    enum: ['ProfilePicture', 'Artwork', 'Image'],
  })
  @ApiOperation({ summary: 'Upload images via cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  cloudinaryUpload(
    @UploadedFile() file: Express.Multer.File,
    @Param('type')
    type: 'ProfilePicture' | 'Artwork' | 'Image',
  ) {
    return this.uploadService.cloudinaryUploadImage(type, file);
  }

  @Post('audio')
  @ApiOperation({ summary: 'Upload audio via cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  cloudinaryUploadAudio(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.cloudinaryUploadAudio(file);
  }
}
