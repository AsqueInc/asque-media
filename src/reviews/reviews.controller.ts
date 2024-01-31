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
import { ReviewsService } from './reviews.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/category/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@ApiTags('review-endpoints')
@Controller('review')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Get('artwork/:artworkId')
  @ApiOperation({ summary: 'Get all reviews of an artwork' })
  getAllArtworkReviews(
    @Query() dto: PaginationDto,
    @Param('artworkId') artworkId: string,
  ) {
    return this.reviewService.getAllArtworkReviews(artworkId, dto);
  }

  @Get(':reviewId')
  @ApiOperation({ summary: 'Get a single review' })
  getSingleReview(@Param('reviewId') reviewId: string) {
    return this.reviewService.getSingleReview(reviewId);
  }

  @Delete(':reviewId')
  @ApiOperation({ summary: 'Delete a review' })
  deleteReview(
    @Param('reviewId') reviewId: string,
    // @Param('profileId') profileId: string,
    @Req() req,
  ) {
    return this.reviewService.deleteReview(reviewId, req.user.profileId);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a review' })
  createReview(@Body() dto: CreateReviewDto, @Req() req) {
    return this.reviewService.createReview(dto, req.user.profileId);
  }

  @Patch(':reviewId')
  @ApiOperation({ summary: 'Update a review' })
  updateReview(
    @Body() dto: UpdateReviewDto,
    @Param('reviewId') reviewId: string,
    // @Param('profileId') profileId: string,
    @Req() req,
  ) {
    return this.reviewService.updateReview(reviewId, req.user.profileId, dto);
  }
}
