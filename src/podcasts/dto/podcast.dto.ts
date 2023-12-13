import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PodcastDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profileId: string;
}
