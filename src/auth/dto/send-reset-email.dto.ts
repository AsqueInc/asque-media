import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendResetPasswordEmailDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
