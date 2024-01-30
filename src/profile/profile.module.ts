import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/utils/util.service';
import { JwtModule } from '@nestjs/jwt';
import { MessageService } from 'src/utils/message.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  providers: [
    ProfileService,
    PrismaService,
    UtilService,
    MessageService,
    PaymentService,
  ],
  controllers: [ProfileController],
  imports: [JwtModule.register({}), CloudinaryModule],
})
export class ProfileModule {}
