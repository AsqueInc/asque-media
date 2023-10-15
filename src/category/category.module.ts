import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma.service';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [CategoryService, PrismaService, EmailNotificationService],
  controllers: [CategoryController],
  imports: [JwtModule.register({})],
})
export class CategoryModule {}
