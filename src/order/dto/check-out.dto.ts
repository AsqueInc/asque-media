import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckOutDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstShippingAddress: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  secondfirstShippingAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  zip: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string;
}
