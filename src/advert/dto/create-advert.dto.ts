import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdvertDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  link: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  text: string;

  @IsOptional()
  @ApiProperty()
  imageUris: string[];
}
