import {
  Controller,
  Param,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { NotifyOrderShipedDto } from './dto/order-shipped.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('order-endpoints')
@UseGuards(JwtGuard)
@ApiSecurity('JWT-auth')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Get details of an order' })
  getOrderDetails(@Param('orderId') orderId: string) {
    return this.orderService.getOrderDetails(orderId);
  }

  @Get('profile/:profileId')
  @ApiOperation({
    summary: 'Get a list of orders and order items made by a user',
  })
  getUserOrders(@Param('profileId') profileId: string) {
    return this.orderService.getUserOrders(profileId);
  }

  // needs refactoring
  @Patch('cancel/:orderId/:profileId')
  @ApiOperation({ summary: 'Cancel an order' })
  cancelOrder(
    @Param('profileId') profileId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.cancelOrder(orderId, profileId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Post('order-item')
  @ApiOperation({ summary: 'add selected artwork and quantity to an order' })
  addOrderItemToOrder(@Body() dto: CreateOrderItemDto) {
    return this.orderService.addOrderItemToOrder(dto);
  }

  @Patch('remove-order-item/:profileId/:orderItemId')
  @ApiOperation({ summary: 'removed selected artwork from an order' })
  removeOrderItemFromOrder(
    @Param('profileId') profileId: string,
    @Param('orderItemId') orderItemId: string,
  ) {
    return this.orderService.removeOrderItemFromOrder(profileId, orderItemId);
  }

  @Patch('checkout/:orderId')
  @ApiOperation({ summary: 'checkout order' })
  checkout(@Body() dto: CheckOutDto, @Param('orderId') orderId: string) {
    return this.orderService.checkout(orderId, dto);
  }

  @Post('shipment-notification')
  @ApiOperation({ summary: 'Notify a user about order shipment via email' })
  notifyUserOrderShipped(@Body() dto: NotifyOrderShipedDto) {
    return this.orderService.notifyUserOrderShipped(dto);
  }
}
