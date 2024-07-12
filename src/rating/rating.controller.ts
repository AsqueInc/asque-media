import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RatingService } from './rating.service';
import { RateItemDto } from './dto/rate-item.dto';

@ApiTags('rating-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('')
  @ApiOperation({ summary: 'Rate an item' })
  rateItem(@Body() dto: RateItemDto, @Req() req) {
    return this.ratingService.rateItem(req.user.profileId, dto);
  }
}
