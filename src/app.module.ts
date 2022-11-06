import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { WarrantyClaimsModule } from './warranty-claims/warranty-claims.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './orm.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    ProductsModule,
    WarrantyClaimsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
