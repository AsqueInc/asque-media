import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from './dto/create-advert.dto';

@ApiTags('advert-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @Post('')
  @ApiOperation({ summary: 'Create an advert' })
  createAdvert(@Body() dto: CreateAdvertDto, @Req() req) {
    return this.advertService.createAdvert(req.user.profileId, dto);
  }
}
