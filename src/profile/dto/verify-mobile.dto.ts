import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyMobileDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  mobileNumber: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
}
