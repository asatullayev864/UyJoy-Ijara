import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus, BookingStatus, UsersRole } from '../common/enums';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) { }

  // 💳 To'lov yaratish
  async create(userId: number, createPaymentDto: CreatePaymentDto) {
    const { booking_id, paid_amount } = createPaymentDto;

    const booking = await this.prismaService.booking.findUnique({
      where: { id: booking_id },
      include: { client: true },
    });
    if (!booking) throw new NotFoundException("Bunday booking topilmadi ❌");

    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (booking.client_id !== userId && user.role != UsersRole.superadmin) {
      throw new BadRequestException("Faqat o'zingizga tegishli booking uchun to'lov qilishingiz mumkin ❗️");
    }

    if (paid_amount <= 0) {
      throw new BadRequestException("To'lov summasi 0 dan katta bo'lishi kerak ❌");
    }
    if (paid_amount > Number(booking.total_price)) {
      throw new BadRequestException("To'lov summasi booking narxidan oshmasligi kerak ❌");
    }

    const payment = await this.prismaService.payment.create({
      data: {
        booking_id,
        total_amount: new Prisma.Decimal(booking.total_price),
        paid_amount: new Prisma.Decimal(paid_amount),
        status: PaymentStatus.paid,
      },
      include: {
        booking: {
          include: {
            house: true,
            client: { select: { id: true, full_name: true, phone: true } },
          },
        },
      },
    });

    if (paid_amount >= Number(booking.total_price)) {
      await this.prismaService.booking.update({
        where: { id: booking_id },
        data: { status: BookingStatus.accepted },
      });
    }

    return {
      message: "To'lov muvaffaqiyatli amalga oshirildi ✅",
      data: payment,
    };
  }

  // 📋 Barcha to'lovlarni olish (faqat adminlar)
  async findAll() {
    const payments = await this.prismaService.payment.findMany({
      include: {
        booking: {
          include: {
            house: true,
            client: { select: { id: true, full_name: true, phone: true } },
          },
        },
      },
    });
    if (!payments.length) throw new NotFoundException("Hali to'lovlar mavjud emas ❌");
    return payments;
  }

  // 👤 Foydalanuvchining o'z to'lovlarini olish
  async findMyPayments(userId: number) {
    const payments = await this.prismaService.payment.findMany({
      where: { booking: { client_id: userId } },
      include: {
        booking: {
          include: {
            house: true,
            client: { select: { id: true, full_name: true, phone: true } },
          },
        },
      },
    });
    if (!payments.length) throw new NotFoundException("Sizda hali to'lovlar mavjud emas ❌");
    return payments;
  }

  // 🔍 Bitta to'lovni topish
  async findOne(userId: number, id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    const payment = await this.prismaService.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            house: true,
            client: { select: { id: true, full_name: true, phone: true } },
          },
        },
      },
    });
    if (!payment) throw new NotFoundException("Bunday to'lov topilmadi ❌");

    if (payment.booking.client_id != userId && user.role != UsersRole.superadmin && user.role != UsersRole.admin) {
      throw new BadRequestException("ID boyicha faqat payment yaratgan user yoki adminlar korishi mumkin ❗️");
    }

    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto, userRole: string) {
    if (userRole !== UsersRole.admin && userRole !== UsersRole.superadmin) {
      throw new BadRequestException("Faqat adminlar to'lov holatini o'zgartira oladi ❌");
    }

    const payment = await this.prismaService.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException("Bunday to'lov topilmadi ❌");

    const updatedPayment = await this.prismaService.payment.update({
      where: { id },
      data: {
        status: updatePaymentDto.status ?? payment.status,
      },
      include: {
        booking: {
          include: {
            house: true,
            client: { select: { id: true, full_name: true, phone: true } },
          },
        },
      },
    });

    return {
      message: "Payment updated successfully 🔄✅",
      data: updatedPayment,
    };
  }

  async remove(id: number, userRole: string) {
    if (userRole !== UsersRole.admin && userRole !== UsersRole.superadmin) {
      throw new BadRequestException("Faqat adminlar to'lovni o'chira oladi ❌");
    }

    const deleted = await this.prismaService.payment.delete({
      where: { id },
      include: {
        booking: {
          include: {
            house: true,
            client: { select: { id: true, full_name: true } },
          },
        },
      },
    });
    if (!deleted) throw new NotFoundException("Bunday to'lov topilmadi ❌");

    return {
      message: "Payment deleted successfully 🗑️✅",
      data: deleted,
    };
  }
}