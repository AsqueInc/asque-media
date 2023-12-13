import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Patch,
  UseInterceptors,
  FileTypeValidator,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { PodcastService } from './podcast.service';
import { PodcastDto } from './dto/podcast.dto';

@ApiTags('Podcast-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Post('audio')
  @ApiOperation({ summary: 'Create an audio podcast' })
  createPodcast(@Body() dto: PodcastDto) {
    return this.podcastService.createAudioPodcast(dto);
  }

  @Post('video')
  @ApiOperation({ summary: 'Create a video podcast' })
  createVideoPodcast(@Body() dto: PodcastDto) {
    return this.podcastService.createVideoPodcast(dto);
  }

  @Get('audio/:audioId')
  @ApiOperation({ summary: 'Get details of an audio podcast' })
  getPodcastDetails(@Param('audioId') audioId: string) {
    return this.podcastService.getPodcastDetails(audioId);
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Get details of an audio podcast' })
  getVideoDetails(@Param('videoId') videoId: string) {
    return this.podcastService.getVideoDetails(videoId);
  }

  @Get('audio/profile/:profleId')
  @ApiOperation({ summary: 'Get all podcasts by profile' })
  getAllPodcastByProfile(@Param('profleId') profleId: string) {
    return this.podcastService.getAllPodcastByProfile(profleId);
  }

  @Get('video/profile/:profleId')
  @ApiOperation({ summary: 'Get all videos by profile' })
  getAllVideosByProfile(@Param('profleId') profleId: string) {
    return this.podcastService.getAllVideosByProfile(profleId);
  }

  @Patch('audio/upload/:podcastId')
  @ApiOperation({ summary: 'Upload podcast audio' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadPodcastAudio(
    @Param('podcastId') podcastId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(mp3)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.podcastService.uploadPodcastAudio(podcastId, file);
  }

  @Patch('video/upload/:videoId')
  @ApiOperation({ summary: 'Upload podcast video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadPodcastVideo(
    @Param('videoId') videoId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(mp4)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.podcastService.uploadVideo(videoId, file);
  }
}
