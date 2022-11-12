import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestContext } from 'nestjs-request-context';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  private response: { data: any; message: string } = { data: '', message: '' };

  async create(createOrderDto: CreateOrderDto) {
    const request = RequestContext.currentContext.req;
    const user = await this.usersRepository.findOneBy({ id: request.user.userId });

    this.dataSource.transaction(async (manager) => {
      const details = createOrderDto.detail.map((_detail) => {
        let orderDetail = new OrderDetail();
        orderDetail.item_code = _detail.item_code;
        orderDetail.item_name = _detail.item_name;
        orderDetail.price = _detail.price;
        orderDetail.qty = _detail.qty;
        orderDetail.total = _detail.price * _detail.qty;
        return orderDetail;
      });

      const savedDetail = await manager.save(details);

      let totalHeader = 0;
      for (const detail of savedDetail) {
        totalHeader = totalHeader + detail.total;
      }

      const order = new Order();
      order.customer_name = createOrderDto.customer_name;
      order.transaction_date = new Date().toISOString();
      order.total_header = totalHeader;
      order.details = savedDetail;
      order.user = user;

      await manager.save(order);
    });

    return { ...this.response, message: 'Successfully creating orders' };
  }

  async findAll() {
    const request = RequestContext.currentContext.req;
    const user = await this.usersRepository.findOneByOrFail({ id: request.user.userId });
    const orders = await this.ordersRepository.find({ where: { user: user } });
    return { ...this.response, data: orders, message: "Successfully retreived user's order" };
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
