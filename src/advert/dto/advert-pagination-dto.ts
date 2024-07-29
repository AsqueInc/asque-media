import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AdvertPaginationDto {
  @IsOptional()
  @ApiProperty({ default: 10 })
  pageSize: number;
}
