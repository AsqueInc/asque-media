import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  category: string[];

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  description: string;

  @IsOptional()
  @ApiProperty()
  albumImageUris: string[];
}
