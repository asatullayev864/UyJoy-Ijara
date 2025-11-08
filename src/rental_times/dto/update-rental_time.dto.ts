import { PartialType } from '@nestjs/swagger';
import { CreateRentalTimeDto } from './create-rental_time.dto';

export class UpdateRentalTimeDto extends PartialType(CreateRentalTimeDto) {}
