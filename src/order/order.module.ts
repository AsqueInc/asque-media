import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, EmailNotificationService],
  imports: [JwtModule.register({})],
})
export class OrderModule {}
