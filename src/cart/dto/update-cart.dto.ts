import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductItemDto } from './create-cart.dto';

export class UpdateCartDto {
  @ApiProperty({
    description: 'List of products to update in the cart',
    type: [ProductItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true }) // ตรวจสอบแต่ละรายการใน Array
  @Type(() => ProductItemDto) // แปลงข้อมูลใน Array ให้เป็น ProductItemDto
  readonly products: ProductItemDto[];
}
