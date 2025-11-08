import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHouseDetailDto } from "./dto/create-house_detail.dto";

@Injectable()
export class HouseDetailsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  create(houseId: number, dto: CreateHouseDetailDto) {
    return this.prisma.houseDetails.create({
      data: { house_id: houseId, ...dto }
    });
  }

  async findAll() {
    const houseDetails = this.prisma.houseDetails.findMany({
      include: {
        house: true,
      },
    });
    if (!houseDetails) {
      throw new NotFoundException('Hali uy haqida qoshimcha malumotlar mavjud emas ❌');
    }
    return houseDetails;
  }

  findOne(houseId: number) {
    const houseDetail = this.prisma.houseDetails.findUnique({
      where: { house_id: houseId }
    });
    if (!houseDetail) {
      throw new NotFoundException('Bu uy haqida haqli qoshimcha malumot berilmagan ❌');
    }
    return houseDetail;
  }

  async update(houseId: number, dto: Partial<CreateHouseDetailDto>) {
    await this.findOne(houseId);
    return this.prisma.houseDetails.update({
      where: { house_id: houseId },
      data: dto
    });
  }

  async remove(houseId: number) {
    await this.findOne(houseId);
    return this.prisma.houseDetails.delete({ where: { house_id: houseId } });
  }
}