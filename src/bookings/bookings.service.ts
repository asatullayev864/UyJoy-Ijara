import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, HouseStatus, UsersRole } from '../common/enums';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(userId: number, createBookingDto: CreateBookingDto) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    const existHouse = await this.prismaService.house.findUnique({ where: { id: createBookingDto.house_id } });
    if (!existHouse) throw new NotFoundException("Bunday uy topilmadi ❌");
    if (existHouse.status != HouseStatus.approved) {
      throw new BadRequestException("Bu uy hali tekshiruvdan o'tmagan 🚫");
    }

    const rentalTime = await this.prismaService.rentalTime.findUnique({
      where: { id: createBookingDto.rental_time_id }
    });
    if (!rentalTime) throw new NotFoundException("Rental time topilmadi ❌");
    if (rentalTime.client_id != userId) throw new BadRequestException("O'zingizga tegishli rental time ni ishlating ❗️");

    const startDate = new Date(createBookingDto.start_date);
    let endDate = new Date(startDate);
    let totalPrice = 0;

    switch (rentalTime.rent_time) {
      case 'day':
        endDate.setDate(startDate.getDate() + createBookingDto.how_many);
        totalPrice = createBookingDto.how_many * rentalTime.price;
        break;

      case 'week':
        endDate.setDate(startDate.getDate() + createBookingDto.how_many * 7);
        totalPrice = createBookingDto.how_many * rentalTime.price;
        break;

      case 'month':
        endDate.setMonth(startDate.getMonth() + createBookingDto.how_many);
        totalPrice = createBookingDto.how_many * rentalTime.price;
        break;

      case 'year':
        endDate.setFullYear(startDate.getFullYear() + createBookingDto.how_many);
        totalPrice = createBookingDto.how_many * rentalTime.price;
        break;

      default:
        throw new BadRequestException("Rental type noto'g'ri ❌");
    }

    const newBooking = await this.prismaService.booking.create({
      data: {
        ...createBookingDto,
        start_date: startDate,
        client_id: userId,
        status: BookingStatus.requested,
        total_price: totalPrice,
        end_date: endDate
      },
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });

    return {
      message: "Created booking successfully ✅",
      data: newBooking
    };
  }

  // faqat adminlar uchun
  async findAll() {
    const bookings = await this.prismaService.booking.findMany({
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });
    if (bookings.length === 0) throw new NotFoundException("Hali tasdiqlangan shartnomalar mavjud emas ❌");

    return bookings;
  }

  // faqat adminlar uchun
  async findByHouse(houseId: number) {
    const bookings = await this.prismaService.booking.findMany({
      where: { house_id: houseId },
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });
    if (bookings.length === 0) throw new NotFoundException("Hali bu uy bilan shartnomalar yoq ❌");

    return bookings;
  }

  // user faqat ozig tegishli shartnomalarni kora oladi
  async findByClient(userId: number) {
    const bookings = await this.prismaService.booking.findMany({
      where: { client_id: userId },
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });
    if (bookings.length === 0) throw new NotFoundException("Sizda hali shartnomalar mavjud emas ❌");

    return bookings;
  }

  // faqat adminlar uchun
  async findByStatus(statuss: string) {
    if (statuss != BookingStatus.accepted && statuss != BookingStatus.completed && statuss != BookingStatus.declined && statuss != BookingStatus.requested) {
      throw new BadRequestException("Iltimos statusni togri kiriting ❗️");
    }
    const bookings = await this.prismaService.booking.findMany({
      where: { status: statuss },
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });
    if (bookings.length === 0) throw new NotFoundException("Bunday statusda shartnomalar mavjud emas ❌");

    return bookings;
  }

  // faqat adminlar uchun
  async findByStartDate(start_datee: string) {
    const bookings = await this.prismaService.booking.findMany({
      where: { start_date: start_datee },
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });
    if (bookings.length === 0) throw new NotFoundException("Bu sanada shartnoma mavjud emas ekan ❌");

    return bookings;
  }

  // faqat adminlar uchun
  async findOne(id: number) {
    const bookings = await this.prismaService.booking.findUnique({
      where: { id },
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });
    if (!bookings) throw new NotFoundException("Bunday shartnomalar mavjud emas ❌");

    return bookings;
  }

  async update(userId: number, id: number, updateBookingDto: UpdateBookingDto, userRole: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: { house: true, client: true, rental_time: true },
    });
    if (!booking) throw new NotFoundException("Bunday shartnoma topilmadi ❌");

    const isOwner = booking.house.owner_id === userId;

    const updateData: any = {};

    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    const isClient = userId == booking.client_id;
    if (!isClient && existUser.role != UsersRole.superadmin && existUser.role != UsersRole.admin) {
      throw new BadRequestException("Faqat ozingizga tegishli hujjatni ozgartirishingiz mumkin ❗️");
    }


    if (updateBookingDto.status !== undefined) {
      if (userRole !== UsersRole.superadmin && userRole !== UsersRole.admin && !isOwner) {
        throw new BadRequestException("Statusni o'zgartirishga ruxsat yo'q ❌");
      }
      updateData.status = updateBookingDto.status;
      const updatedBooking = await this.prismaService.booking.update({
        where: { id },
        data: { status: updateBookingDto.status },
        include: {
          house: true,
          client: {
            select: {
              id: true,
              full_name: true,
              phone: true
            }
          },
          rental_time: true
        }
      });
      return {
        message: "Status updated successfully 🔄✅",
        data: updatedBooking
      };
    }

    let startDate = updateBookingDto.start_date ? new Date(updateBookingDto.start_date) : booking.start_date;
    let howMany = updateBookingDto.how_many ?? booking.how_many;
    let rentalTimeId = updateBookingDto.rental_time_id ?? booking.rental_time_id;

    if (isClient && existUser.role == UsersRole.client) {
      updateBookingDto.status = BookingStatus.requested
    }

    if (updateBookingDto.start_date || updateBookingDto.how_many || updateBookingDto.rental_time_id) {
      const rentalTime = await this.prismaService.rentalTime.findUnique({ where: { id: rentalTimeId } });
      if (!rentalTime) throw new NotFoundException("Rental time topilmadi ❌");
      if (rentalTime.client_id !== booking.client_id) {
        throw new BadRequestException("O'zingizga tegishli rental time ni ishlating ❗️");
      }

      let endDate = new Date(startDate);
      let totalPrice = 0;

      switch (rentalTime.rent_time) {
        case 'day':
          endDate.setDate(startDate.getDate() + howMany);
          totalPrice = howMany * rentalTime.price;
          break;
        case 'week':
          endDate.setDate(startDate.getDate() + howMany * 7);
          totalPrice = howMany * rentalTime.price;
          break;
        case 'month':
          endDate.setMonth(startDate.getMonth() + howMany);
          totalPrice = howMany * rentalTime.price;
          break;
        case 'year':
          endDate.setFullYear(startDate.getFullYear() + howMany);
          totalPrice = howMany * rentalTime.price;
          break;
        default:
          throw new BadRequestException("Rental type noto'g'ri ❌");
      }

      updateData.start_date = startDate;
      updateData.end_date = endDate;
      updateData.how_many = howMany;
      updateData.rental_time_id = rentalTimeId;
      updateData.total_price = new Prisma.Decimal(totalPrice);
      updateData.status = updateBookingDto.status
    }

    const updatedBooking = await this.prismaService.booking.update({
      where: { id },
      data: updateData,
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        },
        rental_time: true
      },
    });

    return {
      message: "Booking updated successfully 🔄✅",
      data: updatedBooking
    }
  }

  // faqat adminlar o'chira oladi
  async remove(id: number) {
    const deletedBooking = await this.prismaService.booking.delete({
      where: { id },
      include: {
        house: true,
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          },
        },
        rental_time: true
      }
    });
    if (!deletedBooking) {
      throw new NotFoundException("Bunday shartnoma topilmadi ❌");
    }

    return {
      message: "Booking deleted successfully 🗑️✅",
      data: deletedBooking
    };
  }
}
