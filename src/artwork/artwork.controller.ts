import {
  Body,
  Controller,
  // FileTypeValidator,
  Get,
  Param,
  // ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  // UploadedFile,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import {
  // ApiBody,
  // ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { PaginationDto } from 'src/category/dto/pagination.dto';
// import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('artwork-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('artwork')
export class ArtworkController {
  constructor(private readonly artWorkService: ArtworkService) {}

  @Get('own')
  @ApiOperation({ summary: 'Get all artwork produced by a user' })
  getAllArtworkByUser(
    // @Param('profileId') profileId: string,
    @Query() dto: PaginationDto,
    @Req() req,
  ) {
    return this.artWorkService.getAllArtworkByUser(req.user.profileId, dto);
  }

  @Get(':artworkId')
  @ApiOperation({ summary: 'Get a single artwork by id' })
  getSingleArtWorkById(@Param('artworkId') artworkId: string) {
    return this.artWorkService.getSingleArtWorkById(artworkId);
  }

  @Post('')
  @ApiOperation({ summary: 'Create an artwork' })
  createArtwork(@Body() dto: CreateArtworkDto, @Req() req) {
    return this.artWorkService.createArtwork(dto, req.user.profileId);
  }

  @Patch(':artworkId')
  @ApiOperation({ summary: 'Update artwork details' })
  updateArtWork(
    @Param('artworkId') artworkId: string,
    // @Param('profileId') profileId: string,
    @Body() dto: UpdateArtworkDto,
    @Req() req,
  ) {
    return this.artWorkService.updateArtWork(
      artworkId,
      req.user.profileId,
      dto,
    );
  }

  // @Post(':artworkId/:profileId/:repositoryId')
  // @ApiOperation({ summary: 'Add artwork to a repository' })
  // addArtworkToRepository(
  //   @Param('artworkId') artworkId: string,
  //   @Param('profileId') profileId: string,
  //   @Param('repositoryId') repositoryId: string,
  // ) {
  //   return this.artWorkService.addArtworkToRepository(
  //     artworkId,
  //     profileId,
  //     repositoryId,
  //   );
  // }

  // @Patch('image/upload/:artworkId')
  // @ApiOperation({ summary: 'Upload artwork images' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: { file: { type: 'string', format: 'binary' } },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file'))
  // uploadArtWorkImage(
  //   // @Param('profileId') profileId: string,
  //   @Param('artworkId') artworkId: string,
  //   @Req() req,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.artWorkService.uploadArtWorkImage(
  //     req.user.profileId,
  //     artworkId,
  //     file,
  //   );
  // }
}
