import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { UploadArtworkImage } from './dto/upload-artwork.dto';

@ApiTags('artwork-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('artwork')
export class ArtworkController {
  constructor(private readonly artWorkService: ArtworkService) {}

  @Get(':artworkId')
  @ApiOperation({ summary: 'Get a single artwork by id' })
  getSingleArtWorkById(@Param('artworkId') artworkId: string) {
    return this.artWorkService.getSingleArtWorkById(artworkId);
  }

  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Get all artwork produced by a user' })
  getAllArtworkByUser(
    @Param('profileId') profileId: string,
    @Query() dto: PaginationDto,
  ) {
    return this.artWorkService.getAllArtworkByUser(profileId, dto);
  }

  @Post('')
  @ApiOperation({ summary: 'Create an artwork' })
  createArtwork(@Body() dto: CreateArtworkDto) {
    return this.artWorkService.createArtwork(dto);
  }

  @Patch(':artworkId/:profileId')
  @ApiOperation({ summary: 'Update artwork details' })
  updateArtWork(
    @Param('artworkId') artworkId: string,
    @Param('profileId') profileId: string,
    @Body() dto: UpdateArtworkDto,
  ) {
    return this.artWorkService.updateArtWork(artworkId, profileId, dto);
  }

  @Patch(':profileId/:artworkId')
  @ApiOperation({ summary: 'Upload artwork images' })
  uploadArtWorkImage(
    @Param('profileId') profileId: string,
    @Param('artworkId') artworkId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadArtworkImage,
  ) {
    return this.artWorkService.uploadArtWorkImage(
      profileId,
      artworkId,
      dto,
      file,
    );
  }
}
