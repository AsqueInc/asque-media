import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  comment: string;

  @ApiProperty()
  @IsOptional()
  @Min(1)
  @Max(10)
  rating: number;
}
