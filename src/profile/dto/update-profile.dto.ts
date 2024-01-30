import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  mobileNumber: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  briefBio: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  socialMediaHandle: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  bank: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @MaxLength(10, {
    message: 'Invalid account number',
  })
  @MinLength(10, {
    message: 'Invalid account number',
  })
  accountNumber: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  accountName: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  websiteLink: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  name: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  profilePicUri: string;
}
