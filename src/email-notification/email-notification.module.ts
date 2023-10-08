import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';

@Module({
  controllers: [],
  providers: [EmailNotificationService],
})
export class EmailNotificationModule {}
