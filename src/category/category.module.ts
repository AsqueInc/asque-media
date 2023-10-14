import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma.service';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';

@Module({
  providers: [CategoryService, PrismaService, EmailNotificationService],
  controllers: [CategoryController],
})
export class CategoryModule {}
