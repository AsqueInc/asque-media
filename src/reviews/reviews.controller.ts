import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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

  @Delete(':reviewId/:profileId')
  @ApiOperation({ summary: 'Delete a review' })
  deleteReview(
    @Param('reviewId') reviewId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.reviewService.deleteReview(reviewId, profileId);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a review' })
  createReview(@Body() dto: CreateReviewDto) {
    return this.reviewService.createReview(dto);
  }

  @Patch(':reviewId/:profileId')
  @ApiOperation({ summary: 'Update a review' })
  updateReview(
    @Body() dto: UpdateReviewDto,
    @Param('reviewId') reviewId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.reviewService.updateReview(reviewId, profileId, dto);
  }
}
