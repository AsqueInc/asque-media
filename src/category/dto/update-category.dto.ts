import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  name: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  detail: string;
}
