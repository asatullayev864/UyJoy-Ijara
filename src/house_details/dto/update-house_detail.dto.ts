import { PartialType } from '@nestjs/swagger';
import { CreateHouseDetailDto } from './create-house_detail.dto';

export class UpdateHouseDetailDto extends PartialType(CreateHouseDetailDto) {}
