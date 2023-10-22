import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/utils/util.service';
import { JwtModule } from '@nestjs/jwt';
import { MessageService } from 'src/utils/message.service';
import { FileUploadService } from 'src/utils/file-upload.service';

@Module({
  providers: [
    ProfileService,
    PrismaService,
    UtilService,
    MessageService,
    FileUploadService,
  ],
  controllers: [ProfileController],
  imports: [JwtModule.register({})],
})
export class ProfileModule {}
