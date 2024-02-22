import {
  Controller,
  Param,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { OrderItemsDto } from './dto/create-order-item.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { ShipOrderDto } from './dto/order-shipped.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChangeOrderStatusDto } from './dto/change-status.dto';

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

  @Get('profile')
  @ApiOperation({
    summary: 'Get a list of orders and order items made by a user',
  })
  getUserOrders(@Req() req) {
    return this.orderService.getUserOrders(req.user.profileId);
  }

  // needs refactoring
  @Patch('cancel/:orderId/')
  @ApiOperation({ summary: 'Cancel an order' })
  cancelOrder(@Param('orderId') orderId: string, @Req() req) {
    return this.orderService.cancelOrder(orderId, req.user.profileId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  createOrder(@Req() req) {
    return this.orderService.createOrder(req.user.profileId);
  }

  @Patch('add-order-items')
  // @ApiBody({ type: [OrderItemsDto] })
  @ApiOperation({ summary: 'create order and add order items' })
  addOrderItems(@Body() dto: OrderItemsDto, @Req() req) {
    return this.orderService.addOrderItems(req.user.profileId, dto);
  }

  @Patch('remove-order-item/:orderItemId')
  @ApiOperation({ summary: 'removed selected artwork from an order' })
  removeOrderItemFromOrder(
    @Param('orderItemId') orderItemId: string,
    @Req() req,
  ) {
    return this.orderService.removeOrderItemFromOrder(
      req.user.profileId,
      orderItemId,
    );
  }

  @Patch('checkout/:orderId')
  @ApiOperation({ summary: 'checkout order' })
  checkout(@Body() dto: CheckOutDto, @Param('orderId') orderId: string) {
    return this.orderService.checkout(orderId, dto);
  }

  @Post('ship')
  @ApiOperation({ summary: 'Ship a user order' })
  shipOrder(@Body() dto: ShipOrderDto, @Req() req) {
    return this.orderService.shipOrder(req.user.userId, dto);
  }

  @Get('shipment/:shipmentId')
  @ApiOperation({ summary: 'Get details of a shipment' })
  getShipmentDetails(@Param('shipmentId') shipmentId: string) {
    return this.orderService.getShipmentDetails(shipmentId);
  }

  @Get('shipment/track/:trackingId')
  @ApiOperation({ summary: 'Track a shipment' })
  trackShipment(@Param('trackingId') trackingId: string) {
    return this.orderService.trackShipment(trackingId);
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Delete an order' })
  deleteOrder(@Param('orderId') orderId: string, @Req() req) {
    return this.orderService.deleteOrder(orderId, req.user.profileId);
  }

  @Patch('status')
  @ApiOperation({ summary: 'Change order status' })
  changeOrderStatus(
    @Body() dto: ChangeOrderStatusDto,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.changeOrderStatus(orderId, dto);
  }
}
