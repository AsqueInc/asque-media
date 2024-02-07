import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ShipOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  payerEmail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  shipmentId: string;
}
