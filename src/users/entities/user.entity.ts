import { Order } from 'src/orders/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @OneToMany((type) => Order, (order) => order.user)
  orders: Order[];
}
