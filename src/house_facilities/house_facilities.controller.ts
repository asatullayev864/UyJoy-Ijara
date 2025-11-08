import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HouseFacilitiesService } from './house_facilities.service';
import { CreateHouseFacilityDto } from './dto/create-house_facility.dto';
import { UpdateHouseFacilityDto } from './dto/update-house_facility.dto';

@Controller('house-facilities')
export class HouseFacilitiesController {
  constructor(private readonly houseFacilitiesService: HouseFacilitiesService) {}

  @Post()
  create(@Body() createHouseFacilityDto: CreateHouseFacilityDto) {
    return this.houseFacilitiesService.create(createHouseFacilityDto);
  }

  @Get()
  findAll() {
    return this.houseFacilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.houseFacilitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHouseFacilityDto: UpdateHouseFacilityDto) {
    return this.houseFacilitiesService.update(+id, updateHouseFacilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.houseFacilitiesService.remove(+id);
  }
}
