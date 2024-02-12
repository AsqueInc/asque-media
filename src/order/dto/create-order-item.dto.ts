import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  artworkId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number = 1;
}

export class OrderItemsDto {
  orderItems: CreateOrderItemDto[];
}
