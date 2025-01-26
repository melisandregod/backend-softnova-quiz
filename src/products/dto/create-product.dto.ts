import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', type: String })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The price of the product',
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  readonly price: number;
}
