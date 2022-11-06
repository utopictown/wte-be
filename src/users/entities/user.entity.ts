import { Product } from 'src/products/entities/product.entity';
import { WarrantyClaim } from 'src/warranty-claims/entities/warranty-claim.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Product, (product) => product.creator)
  product: Product[];

  @OneToMany(() => WarrantyClaim, (warrantyClaim) => warrantyClaim.user)
  warrantyClaims: WarrantyClaim[];
}
