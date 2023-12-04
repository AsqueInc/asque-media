import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@ApiTags('blog-endpoints')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get(':blogId')
  @ApiOperation({ summary: 'Get a single blog by id' })
  getProfile(@Param('blogId') blogId: string) {
    return this.blogService.getSingleBlog(blogId);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a blog' })
  createProfile(@Body() dto: CreateBlogDto) {
    return this.blogService.createBlog(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all blogs by a user' })
  getAllUserBlogs(@Param('userId') userId: string) {
    return this.blogService.getAllUserBlogs(userId);
  }

  @Delete(':userId/:blogId')
  @ApiOperation({ summary: 'Delete a blog' })
  deleteBlog(@Param('userId') userId: string, @Param('blogId') blogId: string) {
    return this.blogService.deleteBlog(userId, blogId);
  }

  @Patch(':userId/:blogId')
  @ApiOperation({ summary: 'Update a blog' })
  updateBlog(
    @Param('userId') userId: string,
    @Param('blogId') blogId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(userId, blogId, dto);
  }
}
