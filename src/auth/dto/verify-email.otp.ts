import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
}
