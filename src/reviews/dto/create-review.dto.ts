import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsOptional()
  @Min(1)
  @Max(10)
  rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  artworkId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profileId: string;
}
