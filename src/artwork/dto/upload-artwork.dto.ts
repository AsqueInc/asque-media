import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UploadArtworkImage {
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  image: number = 1;
}
