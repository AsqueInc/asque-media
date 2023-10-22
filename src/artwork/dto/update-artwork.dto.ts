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
  quantity: number;

  @ApiProperty()
  @IsOptional()
  price: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  artistFullName: string;
}
