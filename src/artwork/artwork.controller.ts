import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  // MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post(':artworkId/:profileId/:repositoryId')
  @ApiOperation({ summary: 'Add artwork to a repository' })
  addArtworkToRepository(
    @Param('artworkId') artworkId: string,
    @Param('profileId') profileId: string,
    @Param('repositoryId') repositoryId: string,
  ) {
    return this.artWorkService.addArtworkToRepository(
      artworkId,
      profileId,
      repositoryId,
    );
  }

  @Patch(':profileId/:artworkId/:artworkNumber')
  @ApiOperation({ summary: 'Upload artwork images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadArtWorkImage(
    @Param('profileId') profileId: string,
    @Param('artworkId') artworkId: string,
    @Param('artworkNumber') artworkNumber: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 3000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.artWorkService.uploadArtWorkImage(
      profileId,
      artworkId,
      artworkNumber,
      file,
    );
  }
}
