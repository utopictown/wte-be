import { User } from 'src/users/entities/user.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  creator: User;
}
