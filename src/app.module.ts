import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmailNotificationModule } from './email-notification/email-notification.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { ProfileModule } from './profile/profile.module';
import { ArtworkModule } from './artwork/artwork.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import * as winston from 'winston';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AlbumModule } from './album/album.module';
import { BlogModule } from './blog/blog.module';
import { ReferralModule } from './referral/referral.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    AuthModule,
    EmailNotificationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      // options
      transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
          dirname: 'logs',
          filename: 'logs.log',
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp} ${level}: ${message}]`;
        }),
      ),
    }),
    ProfileModule,
    ArtworkModule,
    CloudinaryModule,
    OrderModule,
    PaymentModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    AlbumModule,
    BlogModule,
    ReferralModule,
    UploadModule,
    SearchModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
