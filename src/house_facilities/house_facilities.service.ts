import { Injectable } from '@nestjs/common';
import { CreateHouseFacilityDto } from './dto/create-house_facility.dto';
import { UpdateHouseFacilityDto } from './dto/update-house_facility.dto';

@Injectable()
export class HouseFacilitiesService {
  create(createHouseFacilityDto: CreateHouseFacilityDto) {
    return 'This action adds a new houseFacility';
  }

  findAll() {
    return `This action returns all houseFacilities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} houseFacility`;
  }

  update(id: number, updateHouseFacilityDto: UpdateHouseFacilityDto) {
    return `This action updates a #${id} houseFacility`;
  }

  remove(id: number) {
    return `This action removes a #${id} houseFacility`;
  }
}
