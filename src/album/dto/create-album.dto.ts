import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  profileId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  artworkId: string;
}
