import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsEnum } from 'class-validator';
import { PaymentStatus } from '../../common/enums';

export class CreatePaymentDto {
    @ApiProperty({
        example: 1,
        description: "To'lov qaysi booking uchun amalga oshirilayotganini bildiradi",
    })
    @IsInt()
    booking_id: number;

    @ApiProperty({
        example: 5000000,
        description: "To'langan summa (so'mda)",
    })
    @IsPositive()
    paid_amount: number;

    @ApiPropertyOptional({
        example: PaymentStatus.pending,
        description: "To'lov holati — odatda 'pending', 'paid' yoki 'canceled'",
        default: PaymentStatus.pending,
        enum: PaymentStatus,
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    status: PaymentStatus = PaymentStatus.pending;
}
