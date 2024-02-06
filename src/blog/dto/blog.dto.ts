import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsOptional()
  firstImage: string;

  @ApiProperty()
  @IsOptional()
  secondImage: string;

  @ApiProperty()
  @IsOptional()
  thirdImage: string;
}

export class UpdateBlogDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  firstImage: string;

  @ApiProperty()
  @IsOptional()
  secondImage: string;

  @ApiProperty()
  @IsOptional()
  thirdImage: string;
}
