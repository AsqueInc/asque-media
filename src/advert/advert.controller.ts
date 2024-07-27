import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { AdvertPaginationDto } from './dto/advert-pagination-dto';

@ApiTags('advert-endpoints')
@Controller('advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Post('')
  @ApiOperation({ summary: 'Create an advert' })
  createAdvert(@Body() dto: CreateAdvertDto, @Req() req) {
    return this.advertService.createAdvert(req.user.profileId, dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Get('')
  @ApiOperation({ summary: 'Get all adverts' })
  getAllAdverts(@Query() dto: AdvertPaginationDto, @Req() req) {
    return this.advertService.getAllAdverts(dto, req.user.role);
  }

  @Get(':advertId')
  @ApiOperation({ summary: 'Get single advert by id' })
  getSingleAdvert(@Param('advertId') advertId: string) {
    return this.advertService.getSingleAdvert(advertId);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Patch(':advertId')
  @ApiOperation({ summary: 'Update an advert' })
  updateAdvert(
    @Body() dto: UpdateAdvertDto,
    @Req() req,
    @Param('advertId') advertId: string,
  ) {
    return this.advertService.updateAdvert(req.user.profileId, advertId, dto);
  }

  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @Delete(':advertId')
  @ApiOperation({ summary: 'Delete an advert' })
  deleteAdvert(@Req() req, @Param('advertId') advertId: string) {
    return this.advertService.deleteAdvert(req.user.profileId, advertId);
  }
}
