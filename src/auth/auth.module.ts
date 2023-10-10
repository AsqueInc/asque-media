import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from 'src/utils/util.service';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
// import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UtilService,
    EmailNotificationService,
  ],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
