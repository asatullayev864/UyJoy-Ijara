import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus, BookingStatus } from "../../common/enums";

class ClientInfoDto {
    @ApiProperty({ example: 1, description: "Foydalanuvchi IDsi" })
    id: number;

    @ApiProperty({ example: "Jo'rabek Tursunov", description: "Foydalanuvchi to'liq ismi" })
    full_name: string;

    @ApiProperty({ example: "+998901234567", description: "Telefon raqam" })
    phone: string;
}

class HouseInfoDto {
    @ApiProperty({ example: 1, description: "Uy IDsi" })
    id: number;

    @ApiProperty({ example: "Yashil uy", description: "Uy nomi" })
    name: string;

    @ApiProperty({ example: "Toshkent sh., Chilonzor tumani", description: "Uy manzili" })
    address: string;
}

class BookingInfoDto {
    @ApiProperty({ example: 1, description: "Booking IDsi" })
    id: number;

    @ApiProperty({ type: HouseInfoDto, description: "Booking qilgan uy haqida ma'lumot" })
    house: HouseInfoDto;

    @ApiProperty({ type: ClientInfoDto, description: "Booking qilgan foydalanuvchi" })
    client: ClientInfoDto;

    @ApiProperty({ example: 500000, description: "Booking umumiy narxi" })
    total_price: number;

    @ApiProperty({ enum: BookingStatus, example: BookingStatus.accepted, description: "Booking holati" })
    status: BookingStatus;
}

export class PaymentResponseDto {
    @ApiProperty({ example: 1, description: "Payment IDsi" })
    id: number;

    @ApiProperty({ type: BookingInfoDto, description: "Payment bilan bog'liq booking" })
    booking: BookingInfoDto;

    @ApiProperty({ example: 500000, description: "Booking umumiy summasi" })
    total_amount: number;

    @ApiProperty({ example: 300000, description: "Foydalanuvchi to'lgan summa" })
    paid_amount: number;

    @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.paid, description: "Payment holati" })
    status: PaymentStatus;

    @ApiProperty({ example: "2025-11-09T12:00:00.000Z", description: "Payment yaratilgan sana" })
    createdAt: Date;

    @ApiProperty({ example: "2025-11-09T12:30:00.000Z", description: "Payment oxirgi yangilangan sana" })
    updatedAt: Date;
}