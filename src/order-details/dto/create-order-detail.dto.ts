import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNotEmpty()
  item_code: string;

  @IsNotEmpty()
  item_name: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
