import { Module } from '@nestjs/common';
import { RentalTimesService } from './rental_times.service';
import { RentalTimesController } from './rental_times.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RentalTimesController],
  providers: [RentalTimesService],
})
export class RentalTimesModule { }
