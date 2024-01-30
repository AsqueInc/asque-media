import { ApiProperty } from '@nestjs/swagger';
import { SaleType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArtworkDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  category: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  saleType: SaleType;

  @IsString()
  @ApiProperty()
  @IsOptional()
  imageUris: string[];
}
