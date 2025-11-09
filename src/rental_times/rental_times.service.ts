import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRentalTimeDto } from './dto/create-rental_time.dto';
import { UpdateRentalTimeDto } from './dto/update-rental_time.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRole } from '../common/enums';

@Injectable()
export class RentalTimesService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  private async validateUser(userId: number) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User topilmadi ❌");
    return user;
  }

  async create(userId: number, createRentalTimeDto: CreateRentalTimeDto) {

    const existUser = await this.validateUser(userId);
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    if (existUser.role !== UsersRole.client && existUser.role !== UsersRole.superadmin) {
      throw new ForbiddenException("Siz rental time yaratish huquqiga ega emassiz ❌");
    }

    const newRentTime = await this.prismaService.rentalTime.create({
      data: {
        ...createRentalTimeDto,
        client_id: userId
      },
      include: {
        bookings: true
      }
    });

    return {
      message: "Rental time created successfully ✅",
      data: newRentTime
    };
  }

  async findAll() {
    const rentTimes = await this.prismaService.rentalTime.findMany({
      include: {
        bookings: true
      }
    });
    if (rentTimes.length === 0) throw new NotFoundException("Hali tolovlar turi belgilanmagan ❗️");

    return rentTimes;
  }

  async findOne(userId: number, id: number) {

    const existUser = await this.validateUser(userId);
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    const rentTime = await this.prismaService.rentalTime.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });
    if (!rentTime) throw new NotFoundException("Bunday rent time topilmadi ❌");

    if (existUser.role != UsersRole.superadmin && existUser.role != UsersRole.admin && userId != rentTime.client_id) {
      throw new ForbiddenException("Oddiy user faqat oziga tegishli rent time ni korishi mumkin ❗️");
    }

    return rentTime;
  }

  async update(userId: number, id: number, updateRentalTimeDto: UpdateRentalTimeDto) {

    const existUser = await this.validateUser(userId);
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    const existRentTime = await this.prismaService.rentalTime.findUnique({ where: { id } });
    if (!existRentTime) throw new NotFoundException("Bunday rent time topilmadi ❌");

    if (userId != existRentTime.client_id && existUser.role != UsersRole.superadmin) {
      throw new BadRequestException("Tolov oraliq vaqti va naqtini faqat uni yaratgan user ozgartira oladi ❗️");
    }

    const updatedRentalTime = await this.prismaService.rentalTime.update({
      where: { id, client_id: userId },
      data: {
        ...updateRentalTimeDto
      },
      include: {
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
      message: "Rental time updated successfully 🔄✅",
      data: updatedRentalTime
    };
  }

  async remove(userId: number, id: number) {
    const existUser = await this.validateUser(userId);
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    const existRentTime = await this.prismaService.rentalTime.findUnique({ where: { id } });
    if (!existRentTime) throw new NotFoundException("Bunday rent time topilmadi ❌");

    if (userId != existRentTime.client_id && existUser.role != UsersRole.superadmin) {
      throw new BadRequestException("Tolov oraliq vaqti va naqtini faqat uni yaratgan user yoki superadmin o'chira oladi ❗️");
    }

    const updatedRentalTime = await this.prismaService.rentalTime.delete({
      where: { id, client_id: userId },
      include: {
        client: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        }
      }
    });

    return updatedRentalTime;
  }
}
