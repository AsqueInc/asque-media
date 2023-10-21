import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { PrismaService } from 'src/prisma.service';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [RepositoryService, PrismaService, EmailNotificationService],
  controllers: [RepositoryController],
  imports: [JwtModule.register({})],
})
export class RepositoryModule {}
