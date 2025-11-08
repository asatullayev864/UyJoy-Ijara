import { Module } from '@nestjs/common';
import { HouseImagesService } from './house_images.service';
import { HouseImagesController } from './house_images.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HouseImagesController],
  providers: [HouseImagesService],
})
export class HouseImagesModule {}
