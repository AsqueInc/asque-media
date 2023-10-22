import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArtworkDto {
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
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  artistProfileId: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;
}
