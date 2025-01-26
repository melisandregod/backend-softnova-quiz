import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    type: String,
    required: false, 
    example: 'Updated Product Name', 
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    description: 'The price of the product',
    type: Number,
    required: false, 
    example: 100, 
  })
  @IsNumber()
  @IsOptional()
  readonly price?: number;
}
