import { Injectable } from '@nestjs/common';
import { CreateRentalTimeDto } from './dto/create-rental_time.dto';
import { UpdateRentalTimeDto } from './dto/update-rental_time.dto';

@Injectable()
export class RentalTimesService {
  create(createRentalTimeDto: CreateRentalTimeDto) {
    return 'This action adds a new rentalTime';
  }

  findAll() {
    return `This action returns all rentalTimes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rentalTime`;
  }

  update(id: number, updateRentalTimeDto: UpdateRentalTimeDto) {
    return `This action updates a #${id} rentalTime`;
  }

  remove(id: number) {
    return `This action removes a #${id} rentalTime`;
  }
}
