import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalTimesService } from './rental_times.service';
import { CreateRentalTimeDto } from './dto/create-rental_time.dto';
import { UpdateRentalTimeDto } from './dto/update-rental_time.dto';

@Controller('rental-times')
export class RentalTimesController {
  constructor(private readonly rentalTimesService: RentalTimesService) {}

  @Post()
  create(@Body() createRentalTimeDto: CreateRentalTimeDto) {
    return this.rentalTimesService.create(createRentalTimeDto);
  }

  @Get()
  findAll() {
    return this.rentalTimesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalTimesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentalTimeDto: UpdateRentalTimeDto) {
    return this.rentalTimesService.update(+id, updateRentalTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalTimesService.remove(+id);
  }
}
