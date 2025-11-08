import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(userId: number, createFavoriteDto: CreateFavoriteDto) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    const existHouse = await this.prismaService.house.findUnique({ where: { id: createFavoriteDto.house_id } });
    if (!existHouse) throw new NotFoundException("Bunday uy topilmadi ❌");

    const existFavorite = await this.prismaService.favorite.findFirst({
      where: {
        user_id: userId,
        house_id: createFavoriteDto.house_id
      }
    });
    if (existFavorite) {
      throw new BadRequestException("Siz avval bu uyni tanlanganlarga qoshgansiz ✅");
    }
    const newFavorite = await this.prismaService.favorite.create({
      data: {
        house_id: createFavoriteDto.house_id,
        user_id: userId
      },
      include: { house: true }
    });
    return newFavorite;
  }

  async findAll(userId: number) {
    const favorite = await this.prismaService.favorite.findMany({
      where: { user_id: userId },
      include: { house: true }
    });
    if (favorite.length === 0) throw new BadRequestException("Sizda tanlangan uylar hali yoq ❌");

    return favorite;
  }

  async findOne(userId: number, id: number) {
    const existFavorite = await this.prismaService.favorite.findUnique({
      where: { id },
      include: { house: true }
    });
    if (!existFavorite) throw new NotFoundException("Siz tanlagan uylar orasida bunday uy topilmadi ❌");

    if (existFavorite.user_id != userId) {
      throw new BadRequestException("Bu siz tanlagan uy emas ❌");
    }

    return existFavorite;
  }

  async update(userId: number, id: number, updateFavoriteDto: UpdateFavoriteDto) {

    const existFavorite = await this.prismaService.favorite.findUnique({ where: { id } });
    if (!existFavorite) throw new NotFoundException("Bu ID da tanlangan uy topilmadi ❌");

    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    if (userId != existFavorite.user_id) {
      throw new BadRequestException("Faqat ozingizga tegishli tanlangan uylarni ozgartirishingiz mumkin ❗️");
    }

    if (updateFavoriteDto.house_id) {
      const existHouse = await this.prismaService.house.findUnique({ where: { id: updateFavoriteDto.house_id } });
      if (!existHouse) throw new NotFoundException("Bunday uy topilmadi ❌");

      const existsFavorite = await this.prismaService.favorite.findFirst({
        where: {
          user_id: userId,
          house_id: updateFavoriteDto.house_id
        }
      });
      if (existsFavorite && existsFavorite.id !== id) {
        throw new BadRequestException("Siz avval bu uyni tanlanganlarga qoshgansiz ✅");
      }
    }

    const updatedFavorite = await this.prismaService.favorite.update({
      where: { id },
      data: {
        ...(updateFavoriteDto.house_id && { house_id: updateFavoriteDto.house_id })
      }
    });

    return updatedFavorite;
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    const deletedFavorite = await this.prismaService.favorite.delete({ where: { id } });

    return {
      message: "Favorite deleted successfully 🗑️✅",
      data: deletedFavorite
    };
  }
}
