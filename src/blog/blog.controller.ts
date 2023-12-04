import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('user/:profileId')
  @ApiOperation({ summary: 'Get all blogs by a user' })
  getAllUserBlogs(@Param('profileId') profileId: string) {
    return this.blogService.getAllUserBlogs(profileId);
  }

  @Delete(':profileId/:blogId')
  @ApiOperation({ summary: 'Delete a blog' })
  deleteBlog(
    @Param('profileId') profileId: string,
    @Param('blogId') blogId: string,
  ) {
    return this.blogService.deleteBlog(profileId, blogId);
  }

  @Patch(':profileId/:blogId')
  @ApiOperation({ summary: 'Update a blog' })
  updateBlog(
    @Param('profileId') profileId: string,
    @Param('blogId') blogId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(profileId, blogId, dto);
  }

  @Patch('upload/:blogId/:profileId')
  @ApiOperation({ summary: 'Upload an image to a blog' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImageToAlbum(
    @Param('blogId') blogId: string,
    @Param('profileId') profileId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.blogService.addImageToBlog(blogId, profileId, file);
  }
}
