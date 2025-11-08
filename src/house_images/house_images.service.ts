import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseImageDto } from './dto/create-house_image.dto';
import { UpdateHouseImageDto } from './dto/update-house_image.dto';

@Injectable()
export class HouseImagesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createHouseImageDto: CreateHouseImageDto) {
    const { house_id, image_url } = createHouseImageDto;
    return this.prisma.houseImage.create({
      data: {
        house_id,
        image_url,
      },
    });
  }

  async findAll() {
    const images = await this.prisma.houseImage.findMany();
    if (images.length === 0) {
      throw new NotFoundException('Hali uy rasmlari joylanmagan ❌');
    }
    return images;
  }

  async findOne(id: number) {
    const image = await this.prisma.houseImage.findUnique({
      where: { id },
    });
    if (!image) {
      throw new NotFoundException("Uy rasmi topilmadi ❌");
    }
    return image;
  }

  async update(id: number, updateHouseImageDto: UpdateHouseImageDto) {
    const existImage = await this.findOne(id);
    const updatedImage = this.prisma.houseImage.update({
      where: { id },
      data: updateHouseImageDto,
    });
    return {
      message: "Update successfully ✅",
      data: updatedImage
    }
  }

  async remove(id: number) {
    const existImage = await this.findOne(id);
    const deletedImage = await this.prisma.houseImage.delete({
      where: { id },
    });
    return {
      message: "Image deleted successfully 🗑️✅",
      data: deletedImage
    };
  }
}