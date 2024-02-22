import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @ApiProperty()
  orderItems: CreateOrderItemDto[];
}
