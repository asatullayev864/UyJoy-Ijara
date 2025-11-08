import { Module } from '@nestjs/common';
import { HouseDetailsService } from './house_details.service';
import { HouseDetailsController } from './house_details.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HouseDetailsController],
  providers: [HouseDetailsService],
})
export class HouseDetailsModule {}
