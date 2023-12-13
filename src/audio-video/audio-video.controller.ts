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
import { AudioVideoService } from './audio-video.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AudioVideoUploadDto } from './dto/audo-video.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Podcast-endpoints')
@Controller('audio-video')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
export class AudioVideoController {
  constructor(private readonly audioVideoService: AudioVideoService) {}

  @Post('audio')
  @ApiOperation({ summary: 'Create an audio podcast' })
  createPodcast(@Body() dto: AudioVideoUploadDto) {
    return this.audioVideoService.createPodcast(dto);
  }

  @Post('video')
  @ApiOperation({ summary: 'Create a video podcast' })
  createVideoPodcast(@Body() dto: AudioVideoUploadDto) {
    return this.audioVideoService.createVideo(dto);
  }

  @Get('audio/:audioId')
  @ApiOperation({ summary: 'Get details of an audio podcast' })
  getPodcastDetails(@Param('audioId') audioId: string) {
    return this.audioVideoService.getPodcastDetails(audioId);
  }

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Get details of an audio podcast' })
  getVideoDetails(@Param('videoId') videoId: string) {
    return this.audioVideoService.getVideoDetails(videoId);
  }

  @Get('audio/profile/:profleId')
  @ApiOperation({ summary: 'Get all podcasts by profile' })
  getAllPodcastByProfile(@Param('profleId') profleId: string) {
    return this.audioVideoService.getAllPodcastByProfile(profleId);
  }

  @Get('video/profile/:profleId')
  @ApiOperation({ summary: 'Get all videos by profile' })
  getAllVideosByProfile(@Param('profleId') profleId: string) {
    return this.audioVideoService.getAllVideosByProfile(profleId);
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
    return this.audioVideoService.uploadPodcastAudio(podcastId, file);
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
    return this.audioVideoService.uploadVideo(videoId, file);
  }
}
