import { IsNotEmpty } from 'class-validator';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  customer_name: string;

  @Column({ type: 'datetime' })
  @IsNotEmpty()
  transaction_date: string;

  @Column('numeric')
  @IsNotEmpty()
  total_header: number;

  @OneToMany((type) => OrderDetail, (orderDetail) => orderDetail.order, { eager: true })
  details: OrderDetail[];

  @ManyToOne((type) => User, (user) => user.orders, { eager: true })
  user: User;
}
