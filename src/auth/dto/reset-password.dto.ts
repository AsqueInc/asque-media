import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, {
    message:
      'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(20, {
    message:
      'password is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,20}$/, {
    message:
      'password must contain the following: a capital letter, a small letter, and a number',
  })
  newPassword: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  confirmNewPassword: string;
}
