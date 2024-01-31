import {
  Body,
  Controller,
  Delete,
  // FileTypeValidator,
  Get,
  Param,
  // ParseFilePipe,
  // Patch,
  Post,
  Query,
  Req,
  // UploadedFile,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import {
  // ApiBody,
  // ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AlbumService } from './album.service';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteAlbumImageDto } from './dto/delete-album-image.dto';

@ApiTags('album-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get(':albumId')
  @ApiOperation({ summary: 'Get an album by album id' })
  getAlbumDetailsById(@Param('albumId') albumId: string) {
    return this.albumService.getAlbumDetailsById(albumId);
  }

  @Get('own')
  @ApiOperation({ summary: 'Get all albums created by a profile' })
  getAllAlbumsByProfileId(
    @Req() req,
    // @Param('ProfileId') profileId: string,
    @Query() dto: PaginationDto,
  ) {
    return this.albumService.getAllAlbumsByProfileId(req.user.profileId, dto);
  }

  @Delete(':albumId/:profileId')
  @ApiOperation({ summary: 'Delete an album' })
  deleteAlbum(
    @Param('albumId') albumId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.albumService.deleteAlbum(albumId, profileId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an album for an artwork' })
  createAlbum(@Body() dto: CreateAlbumDto, @Req() req) {
    return this.albumService.createAlbum(dto, req.user.profileId);
  }

  // @Patch('upload/:albumId')
  // @ApiOperation({ summary: 'Upload an image to an album' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: { file: { type: 'string', format: 'binary' } },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file'))
  // uploadImageToAlbum(
  //   @Param('albumId') albumId: string,
  //   // @Param('profileId') profileId: string,
  //   @Req() req,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.albumService.uploadImageToAlbum(
  //     albumId,
  //     req.user.profileId,
  //     file,
  //   );
  // }

  @Delete('image/:albumId')
  @ApiOperation({ summary: 'Delete an album image ' })
  deleteAlbumImage(
    @Param('albumId') albumId: string,
    @Req() req,
    // @Param('profileId') profileId: string,
    @Body() dto: DeleteAlbumImageDto,
  ) {
    return this.albumService.deleteAlbumImage(albumId, req.user.profileId, dto);
  }
}
