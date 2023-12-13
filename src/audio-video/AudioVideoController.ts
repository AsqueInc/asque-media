import { Body, Controller } from '@nestjs/common';
import { AudioVideoService } from './audio-video.service';
import { CreateArtworkDto } from 'src/artwork/dto/create-artwork.dto';

@Controller('audio-video')
export class AudioVideoController {
  constructor(private readonly audioVideoService: AudioVideoService) {}

  @Post('audio')
  @ApiOperation({ summary: 'Create an artwork' })
  createPodcast(@Body() dto: CreateArtworkDto) {
    return this.audioVideoService.createPodcast(dto);
  }
}
