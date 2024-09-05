import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy,  RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  create(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.client.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
  }


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError(error => {
          throw new RpcException(error)
        }));
  }


  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.client.send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError(error => {
          throw new RpcException(error)
        }));
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number,) {
    return this.client.send({ cmd: 'delete_product' }, { id, })
      .pipe(
        catchError(error => {
          throw new RpcException(error)
        }));
  }

}
