import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';

export enum RentalTime {
    kun = "kun",
    hafta = "hafta",
    oy = "oy",
    yil = "yil"
}

export class CreateRentalTimeDto {
    @ApiProperty({
        description: "To'lov turi",
        enum: RentalTime,
        example: RentalTime.kun
    })
    @IsEnum(RentalTime, { message: "rent_time faqat `kun`, `hafta`, `oy`, yoki `yil` bo'lishi mumkin" })
    rent_time: RentalTime;

    @ApiProperty({
        description: "Narx",
        example: 50000
    })
    @IsInt({ message: "price butun son bo'lishi kerak" })
    @Min(0, { message: "price manfiy bo'lishi mumkin emas" })
    price: number;
}
