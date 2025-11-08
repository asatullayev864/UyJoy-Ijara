import { Module } from '@nestjs/common';
import { RentalTimesService } from './rental_times.service';
import { RentalTimesController } from './rental_times.controller';

@Module({
  controllers: [RentalTimesController],
  providers: [RentalTimesService],
})
export class RentalTimesModule {}
