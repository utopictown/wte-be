import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/orders/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  item_code: string;

  @Column()
  @IsNotEmpty()
  item_name: string;

  @Column('numeric')
  @IsNotEmpty()
  qty: number;

  @Column('numeric')
  @IsNotEmpty()
  price: number;

  @Column('numeric')
  @IsNotEmpty()
  total: number;

  @ManyToOne((type) => Order, (order) => order.details)
  order: Order;
}
