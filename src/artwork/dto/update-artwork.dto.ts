import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateArtworkDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  title: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  category: string[];

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  imageUris: string[];
}
