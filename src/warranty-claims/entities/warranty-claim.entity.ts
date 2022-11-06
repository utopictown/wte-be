import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm';

export enum ClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class WarrantyClaim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ClaimStatus, default: ClaimStatus.PENDING })
  status: ClaimStatus;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.warrantyClaims, { eager: true })
  user: User;

  @ManyToOne(() => Product, { eager: true })
  product: Product;
}
