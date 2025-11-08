import { Module } from '@nestjs/common';
import { HouseFacilitiesService } from './house_facilities.service';
import { HouseFacilitiesController } from './house_facilities.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HouseFacilitiesController],
  providers: [HouseFacilitiesService],
})
export class HouseFacilitiesModule {}
