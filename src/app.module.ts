import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmailNotificationModule } from './email-notification/email-notification.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { ProfileModule } from './profile/profile.module';
import { RepositoryModule } from './category/repository.module';
import { ArtworkModule } from './artwork/artwork.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import * as winston from 'winston';

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
    RepositoryModule,
    ArtworkModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
