import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseFacilityDto } from './dto/create-house_facility.dto';
import { UpdateHouseFacilityDto } from './dto/update-house_facility.dto';

@Injectable()
export class HouseFacilitiesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createHouseFacilityDto: CreateHouseFacilityDto) {
    return await this.prisma.houseFacility.create({
      data: createHouseFacilityDto,
    });
  }

  async findAll() {
    return await this.prisma.houseFacility.findMany({
      include: {
        house: true,
      },
    });
  }

  async findOne(id: number) {
    const facility = await this.prisma.houseFacility.findUnique({
      where: { id },
      include: { house: true },
    });

    if (!facility) {
      throw new NotFoundException("Qulaylik topilmadi ❌");
    }

    return facility;
  }

  async update(id: number, updateHouseFacilityDto: UpdateHouseFacilityDto) {
    await this.findOne(id);

    const updated = await this.prisma.houseFacility.update({
      where: { id },
      data: updateHouseFacilityDto,
    });

    return {
      message: "Qulaylik muvaffaqiyatli yangilandi ✅",
      data: updated,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    const deleted = await this.prisma.houseFacility.delete({
      where: { id },
    });

    return {
      message: "Qulaylik muvaffaqiyatli o'chirildi 🗑️✅",
      data: deleted,
    };
  }
}