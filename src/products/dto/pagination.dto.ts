import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty({
    description: 'Number of items to skip',
    type: Number,
    required: false, 
    example: 1, 
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number) 
  skip: number;

  @ApiProperty({
    description: 'Number of items to return',
    type: Number,
    required: false, 
    example: 10, 
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number) 
  limit: number;
}
