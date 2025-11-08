import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHouseDto } from './create-house.dto';
import { HouseStatus } from '../../common/enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateHouseDto extends PartialType(CreateHouseDto) {
    @ApiProperty({
            description: 'City where the house is located',
            example: 'Tashkent',
        })
        @IsEnum(HouseStatus, { message: 'Faqat pending, approved, rejected kiritishingiz mumkin ❗️' })
        @IsNotEmpty({ message: 'City is required' })
    status: HouseStatus
}
