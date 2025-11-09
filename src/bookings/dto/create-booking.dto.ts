import { ApiProperty } from "@nestjs/swagger";
import {
    IsInt,
    IsPositive,
    IsDateString,
    IsNotEmpty
} from "class-validator";

export class CreateBookingDto {
    @ApiProperty({ example: 1, description: "Ijaraga olinadigan uy ID raqami" })
    @IsInt({ message: "house_id butun son bo'lishi kerak" })
    @IsPositive({ message: "house_id musbat son bo'lishi kerak" })
    house_id: number;

    @ApiProperty({ example: 3, description: "Ijara muddati (rental_time) ID raqami" })
    @IsInt({ message: "rental_time_id butun son bo'lishi kerak" })
    @IsPositive({ message: "rental_time_id musbat son bo'lishi kerak" })
    rental_time_id: number;

    @ApiProperty({ example: "2025-11-10", description: "Ijara boshlanadigan sana (ISO formatda)" })
    @IsNotEmpty({ message: "start_date bo'sh bo'lmasligi kerak" })
    @IsDateString({}, { message: "start_date ISO formatdagi sana bo'lishi kerak" })
    start_date: Date;

    @ApiProperty({ example: 2, description: "Necha kunga ijaraga olinadi yoki necha kishi uchun" })
    @IsInt({ message: "how_many butun son bo'lishi kerak" })
    @IsPositive({ message: "how_many musbat son bo'lishi kerak" })
    how_many: number;

    // Swagger uchun read-only maydonlar
    @ApiProperty({ description: "Booking oxirgi sanasi", readOnly: true })
    end_date?: Date;

    @ApiProperty({ description: "Umumiy ijara narxi", readOnly: true })
    total_price?: number;
}