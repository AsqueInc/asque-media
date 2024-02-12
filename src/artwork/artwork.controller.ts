import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { PaginationDto } from 'src/category/dto/pagination.dto';

@ApiTags('artwork-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('artwork')
export class ArtworkController {
  constructor(private readonly artWorkService: ArtworkService) {}

  @Get('own')
  @ApiOperation({ summary: 'Get all artwork produced by a user' })
  getAllArtworkByUser(@Query() dto: PaginationDto, @Req() req) {
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
    @Body() dto: UpdateArtworkDto,
    @Req() req,
  ) {
    return this.artWorkService.updateArtWork(
      artworkId,
      req.user.profileId,
      dto,
    );
  }

  @Get('category/:categoryName')
  @ApiOperation({ summary: 'Get all artwork by category name' })
  getAllArtworkInACategory(
    @Query() dto: PaginationDto,
    @Param('categoryName') categoryName: string,
  ) {
    return this.artWorkService.getAllArtworkInACategory(categoryName, dto);
  }
}
