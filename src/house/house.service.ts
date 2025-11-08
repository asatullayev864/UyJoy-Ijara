import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HouseStatus, UsersRole } from '../common/enums';

@Injectable()
export class HouseService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createHouseDto: CreateHouseDto, userId: number) {
    const is_owner = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (is_owner.role == UsersRole.client) {
      throw new BadRequestException("Siz ijara uyi yarata olmaysiz ❌");
    }

    const newHouse = await this.prismaService.house.create({
      data: {
        ...createHouseDto,
        owner_id: userId
      }
    });

    return newHouse;
  }

  async findAll() {
    const houses = await this.prismaService.house.findMany({
      where: {
        status: HouseStatus.approved
      },
      include: {
        owner: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        },
        details: true,
        images: true,
        facilities: true
      }
    });

    return houses;
  }

  async findByProvince(province: string) {
    const houseByProvince = await this.prismaService.house.findMany({
      where: {
        province: province as any,
        status: HouseStatus.approved,
      },
      include: {
        owner: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        },
        details: true,
        images: true,
        facilities: true
      }
    })

    if (houseByProvince.length === 0) throw new NotFoundException(`${province} viloyatida tasdiqlangan uylar topilmadi ❌`);

    return houseByProvince;
  }

  async findOne(id: number) {
    const house = await this.prismaService.house.findFirst({
      where: {
        id,
        status: HouseStatus.approved
      },
      include: {
        owner: {
          select: {
            id: true,
            full_name: true,
            phone: true
          }
        },
        details: true,
        images: true,
        facilities: true
      }
    });

    if (!house) throw new NotFoundException("Bunday uy topilmadi yoki hali uy tasdiqlanmagan ❌");
    return house;
  }

  async update(id: number, updateHouseDto: UpdateHouseDto, userId: number) {
    const { status } = updateHouseDto;
    const house = await this.prismaService.house.findUnique({ where: { id } });
    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    });
    if (status) {
      if (user.role != UsersRole.superadmin && user.role != UsersRole.admin) {
        throw new BadRequestException("Sizda status ozgartirishga huquq yoq ❌");
      }
      return await this.prismaService.house.update({ where: { id }, data: { status } });
    }
    if (user.role != UsersRole.owner || house.owner_id != userId) {
      throw new BadRequestException('Uy malumotlarini faqat uy egasi ozgartira oladi ❗️')
    }
    const updatedHouse = await this.prismaService.house.update({
      where: { id },
      data: {
        ...updateHouseDto,
        status: HouseStatus.pending
      }
    });
    return updatedHouse;
  }

  async remove(id: number, userId: number) {
    const house = await this.prismaService.house.findUnique({ where: { id } });

    if (!house) {
      throw new NotFoundException('Bunday uy topilmadi ❌');
    }

    if (userId != house.owner_id) {
      throw new BadRequestException("Faqat ozingizga tegishli uyni o'chirishingiz mumkin ❗️");
    }

    const deletedHouse = await this.prismaService.house.delete({ where: { id } });
    return deletedHouse;
  }
}
