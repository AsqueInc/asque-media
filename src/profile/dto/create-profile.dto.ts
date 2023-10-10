import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  mobileNumber: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  firstName: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  lastName: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  profilePicUri: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  userId: string;
}
