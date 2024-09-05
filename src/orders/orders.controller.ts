import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from 'src/common/dto/order-pagination.dto';
import { StatusOrderDto } from './dto';

@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      return await firstValueFrom(this.client.send('findAllOrders', orderPaginationDto));
    } catch (error) {
      throw new RpcException(error)

    }
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder', { id }).pipe(
      catchError(error => {
        throw new RpcException(error)
      }));
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusOrderDto: StatusOrderDto
  ) {
    return this.client.send('changeOrderStatus', { id, ...statusOrderDto }).pipe(
      catchError(error => {
        throw new RpcException(error)
      }));
  }



}
