import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { ArtworkController } from './artwork.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  providers: [ArtworkService, PrismaService],
  controllers: [ArtworkController],
  imports: [JwtModule.register({}), CloudinaryModule],
})
export class ArtworkModule {}
