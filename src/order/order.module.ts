import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MessageService } from 'src/utils/message.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, MessageService],
  imports: [JwtModule.register({})],
})
export class OrderModule {}
