import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  UseGuards,
  // UseInterceptors,
  // UploadedFile,
  // ParseFilePipe,
  // FileTypeValidator,
  Req,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  // ApiBody,
  // ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
// import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/category/dto/pagination.dto';

@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@ApiTags('story-endpoints')
@Controller('story')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

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

  @Get('own')
  @ApiOperation({ summary: 'Get all stories by a profile' })
  getAllUserBlogs(
    @Req() req,
    @Query() dto: PaginationDto,
    // @Param('profileId') profileId: string
  ) {
    return this.blogService.getAllUserBlogs(req.user.profileId, dto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all stores' })
  getAllBlogs(@Query() dto: PaginationDto) {
    return this.blogService.getAllBlogs(dto);
  }

  @Delete(':storyId')
  @ApiOperation({ summary: 'Delete a story' })
  deleteBlog(
    // @Param('profileId') profileId: string,
    @Param('storyId') storyId: string,
    @Req() req,
  ) {
    return this.blogService.deleteBlog(req.user.profileId, storyId);
  }

  @Patch(':storyId')
  @ApiOperation({ summary: 'Update a story' })
  updateBlog(
    @Req() req,
    // @Param('profileId') profileId: string,
    @Param('storyId') storyId: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(req.user.profileId, storyId, dto);
  }

  // @Patch('upload/:storyId')
  // @ApiOperation({ summary: 'Upload an image to a story' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: { file: { type: 'string', format: 'binary' } },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file'))
  // uploadImageToAlbum(
  //   @Param('storyId') storyId: string,
  //   // @Param('profileId') profileId: string,
  //   @Req() req,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.blogService.addImageToBlog(storyId, req.user.profileId, file);
  // }
}
