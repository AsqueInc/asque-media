import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum SubscriptionEnum {
  Freemium = 'freemium',
  Premium = 'premium',
}

export class ProcessPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  orderId: string;
}

export class SubscribeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: SubscriptionEnum })
  subscriptionPlan: SubscriptionEnum;
}
