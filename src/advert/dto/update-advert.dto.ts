import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdvertDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  link: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  text: string;

  @IsOptional()
  @ApiProperty()
  imageUris: string[];
}
