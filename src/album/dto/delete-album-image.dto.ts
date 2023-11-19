import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAlbumImageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  imageUri: string;
}
