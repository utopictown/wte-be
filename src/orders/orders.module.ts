import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, User])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
