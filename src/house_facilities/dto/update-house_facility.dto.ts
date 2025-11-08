import { PartialType } from '@nestjs/swagger';
import { CreateHouseFacilityDto } from './create-house_facility.dto';

export class UpdateHouseFacilityDto extends PartialType(CreateHouseFacilityDto) {}
