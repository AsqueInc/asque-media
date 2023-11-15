import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, PrismaService],
  imports: [JwtModule.register({}), CloudinaryModule],
})
export class AlbumModule {}
