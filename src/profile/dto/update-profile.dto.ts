import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
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
}
