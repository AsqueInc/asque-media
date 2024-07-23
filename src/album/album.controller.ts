import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AlbumService } from './album.service';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { DeleteAlbumImageDto } from './dto/delete-album-image.dto';
import { CreateStockImageDto } from './dto/create-stock-image.dto';

@ApiTags('album-endpoints')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get('own')
  @ApiOperation({ summary: 'Get all albums created by a profile' })
  getAllAlbumsByProfileId(@Req() req, @Query() dto: PaginationDto) {
    return this.albumService.getAllAlbumsByProfileId(req.user.profileId, dto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all albums ' })
  getAllAlbums(@Query() dto: PaginationDto) {
    return this.albumService.getAllAlbums(dto);
  }

  @Get('newest')
  @ApiOperation({ summary: 'Get ten newest albums ' })
  getNewestArtwork() {
    return this.albumService.getNewestAlbums();
  }

  @Get(':albumId')
  @ApiOperation({ summary: 'Get an album by album id' })
  getAlbumDetailsById(@Param('albumId') albumId: string) {
    return this.albumService.getAlbumDetailsById(albumId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Delete(':albumId')
  @ApiOperation({ summary: 'Delete an album' })
  deleteAlbum(@Param('albumId') albumId: string, @Req() req) {
    return this.albumService.deleteAlbum(albumId, req.user.profileId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Create an album for an artwork' })
  createAlbum(@Body() dto: CreateAlbumDto, @Req() req) {
    return this.albumService.createAlbum(dto, req.user.profileId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('stock')
  @ApiOperation({ summary: 'Create stock image' })
  createStockImage(@Body() dto: CreateStockImageDto) {
    return this.albumService.createStockImage(dto);
  }

  @Get('stock/:stockImageId')
  @ApiOperation({ summary: 'Get all stock images' })
  getAllStockImages(
    @Query() dto: PaginationDto,
    @Param('stockImageId') stockImageId: string,
  ) {
    return this.albumService.getAllStockImages(stockImageId, dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Delete('image/:albumId')
  @ApiOperation({ summary: 'Delete an album image ' })
  deleteAlbumImage(
    @Param('albumId') albumId: string,
    @Req() req,
    @Body() dto: DeleteAlbumImageDto,
  ) {
    return this.albumService.deleteAlbumImage(albumId, req.user.profileId, dto);
  }

  @Get('category/:categoryName')
  @ApiOperation({ summary: 'Get all albums by category name' })
  getAllAlbumsInACategory(
    @Query() dto: PaginationDto,
    @Param('categoryName') categoryName: string,
  ) {
    return this.albumService.getAllAlbumsInACategory(categoryName, dto);
  }
}
