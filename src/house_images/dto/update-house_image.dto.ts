import { PartialType } from '@nestjs/swagger';
import { CreateHouseImageDto } from './create-house_image.dto';

export class UpdateHouseImageDto extends PartialType(CreateHouseImageDto) {}
