import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PaginationDto } from 'src/category/dto/pagination.dto';

@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@ApiTags('story-endpoints')
@Controller('story')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('own')
  @ApiOperation({ summary: 'Get all stories by a profile' })
  getAllUserBlogs(@Req() req, @Query() dto: PaginationDto) {
    return this.blogService.getAllUserBlogs(req.user.profileId, dto);
  }

  @Get('newest')
  @ApiOperation({ summary: 'Get ten newest stories ' })
  getNewestArtwork() {
    return this.blogService.getNewestStories();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all stories' })
  getAllBlogs(@Query() dto: PaginationDto) {
    return this.blogService.getAllBlogs(dto);
  }

  @Get(':storyId')
  @ApiOperation({ summary: 'Get a single story by id' })
  getProfile(@Param('storyId') storyId: string) {
    return this.blogService.getSingleBlog(storyId);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a story' })
  createProfile(@Body() dto: CreateBlogDto, @Req() req) {
    return this.blogService.createBlog(dto, req.user.profileId);
  }

  @Delete(':storyId')
  @ApiOperation({ summary: 'Delete a story' })
  deleteBlog(@Param('storyId') storyId: string, @Req() req) {
    return this.blogService.deleteBlog(req.user.profileId, storyId);
  }

  @Patch(':storyId')
  @ApiOperation({ summary: 'Update a story' })
  updateBlog(
    @Req() req,
    @Param('storyId') storyId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(req.user.profileId, storyId, dto);
  }
}
