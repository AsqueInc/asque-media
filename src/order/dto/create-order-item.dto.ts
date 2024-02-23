import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  artworkId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number = 1;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  price: number;
}

export class OrderItemsDto {
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsOptional()
  @ApiProperty()
  zip: string;

  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsOptional()
  @ApiProperty()
  referrerCOde: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsNotEmpty()
  orderItems: CreateOrderItemDto[];
}
