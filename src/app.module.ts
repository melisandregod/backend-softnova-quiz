import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      user: 'root',
      pass: 'example',
      dbName: 'BaanNaayDin',
    }),
    ProductsModule,
    CartModule,
  ],
})
export class AppModule {}
