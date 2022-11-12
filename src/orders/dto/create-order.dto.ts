import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateOrderDetailDto } from 'src/order-details/dto/create-order-detail.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  customer_name: string;

  @IsNotEmpty()
  @IsDateString()
  transaction_date: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => CreateOrderDetailDto)
  detail: CreateOrderDetailDto[];
}
