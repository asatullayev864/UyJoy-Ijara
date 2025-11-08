import { Module } from '@nestjs/common';
import { HouseFacilitiesService } from './house_facilities.service';
import { HouseFacilitiesController } from './house_facilities.controller';

@Module({
  controllers: [HouseFacilitiesController],
  providers: [HouseFacilitiesService],
})
export class HouseFacilitiesModule {}
