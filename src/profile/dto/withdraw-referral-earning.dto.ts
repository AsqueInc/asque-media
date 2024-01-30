import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawReferralEarningDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  recipientAccountNumber: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  recipientAccountCode: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  recipientName: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  recipientEmail: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  bankCode: string;
}
