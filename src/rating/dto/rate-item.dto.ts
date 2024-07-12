import { ApiProperty } from '@nestjs/swagger';
import { LikeType } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class RateItemDto {
  @ApiProperty({ enum: LikeType })
  @IsNotEmpty()
  itemType: LikeType;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  itemId: string;
}
