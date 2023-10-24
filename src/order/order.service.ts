import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder() {}

  async getUserOrder() {}

  async getOrderDetails() {}

  async updateOrderStatus() {}

  async cancelOrder() {}
}
