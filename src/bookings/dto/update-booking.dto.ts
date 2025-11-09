import { PartialType, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateBookingDto } from "./create-booking.dto";
import { BookingStatus } from "../../common/enums";
import { IsEnum, IsOptional, IsDateString, IsInt, Min } from "class-validator";

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @ApiPropertyOptional({
        description: "Booking statusni yangilash (faqat admin, superadmin yoki uy egasi uchun)",
        enum: BookingStatus
    })
    @IsOptional()
    @IsEnum(BookingStatus, { message: "Status noto'g'ri" })
    status?: BookingStatus;

    @ApiPropertyOptional({ description: "Shartnoma boshlanish sanasi YYYY-MM-DD formatida" })
    @IsOptional()
    @IsDateString({}, { message: "start_date noto'g'ri formatda" })
    start_date?: Date;

    @ApiPropertyOptional({ description: "Necha kun/hafta/oy/yil ijaraga olinayotgani", minimum: 1 })
    @IsOptional()
    @IsInt({ message: "how_many butun son bo'lishi kerak" })
    @Min(1, { message: "how_many 1 dan kam bo'lishi mumkin emas" })
    how_many?: number;

    @ApiPropertyOptional({ description: "Rental time ID" })
    @IsOptional()
    @IsInt({ message: "rental_time_id butun son bo'lishi kerak" })
    rental_time_id?: number;

    @ApiPropertyOptional({ description: "Qo'shimcha izoh yoki notes maydoni" })
    @IsOptional()
    notes?: string;
}
