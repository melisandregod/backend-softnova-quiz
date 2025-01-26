import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductItemDto {
  @ApiProperty({ description: 'The ID of the product', type: String })
  @IsString()
  @IsMongoId()
  readonly productId: string;

  @ApiProperty({
    description: 'The quantity of the product',
    type: Number,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  readonly quantity: number;
}

export class CreateCartDto {
  @ApiProperty({
    description: 'List of products in the cart',
    type: [ProductItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto) // แปลงข้อมูลใน Array ให้เป็น ProductItemDto
  readonly products: ProductItemDto[];
}

//นำ Productมาทำ เป็น array โดยใช้ type?
