import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRole } from '../common/enums';

@Injectable()
export class ReviewsService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(userId: number, createReviewDto: CreateReviewDto) {
    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!existUser) throw new NotFoundException("Bunday user topilmadi ❌");

    const existHouse = await this.prismaService.house.findUnique({ where: { id: createReviewDto.house_id } });
    if (!existHouse) throw new NotFoundException("Bunday uy topilmadi ❌");

    const newReview = await this.prismaService.review.create({
      data: {
        ...createReviewDto,
        user_id: userId
      },
      include: {
        house: true
      }
    });
    return newReview;
  }

  async findAll() {
    const reviews = await this.prismaService.review.findMany({ include: { house: true } });
    if (reviews.length === 0) return { message: "Hali baholangan uylar mavjud emas ❌" };

    return reviews;
  }

  async findHouse(houseId: number) {
    const reviews = await this.prismaService.review.findMany({
      where: { house_id: houseId },
      include: {
        house: true
      }
    });
    if (reviews.length === 0) return { message: "Hali bu uyga baho berilmagan ❌" };

    return reviews;
  }

  async findOne(id: number) {
    const review = await this.prismaService.review.findUnique({ where: { id }, include: { house: true } });
    if (!review) throw new NotFoundException("Bunday baholash topilmadi ❌");

    return review;
  }

  async update(userId: number, id: number, updateReviewDto: UpdateReviewDto) {
    const existReview = await this.findOne(id);
    if (existReview.user_id != userId) throw new BadRequestException('Baholashni faqat baholagan user ozgartira oladi ❗️');

    if (updateReviewDto.house_id) {
      const existHouse = await this.prismaService.house.findUnique({ where: { id: updateReviewDto.house_id } });
      if (!existHouse) throw new NotFoundException("Bunday uy topilmadi ❌");
    }

    const updatedReview = await this.prismaService.review.update({
      where: { id },
      data: {
        ...updateReviewDto,
        user_id: userId
      },
      include: {
        house: true
      }
    });

    return {
      message: "Review updated successfully 🔄✅",
      data: updatedReview
    }
  }

  async remove(userId: number, id: number) {
    const existReview = await this.findOne(id);
    const existUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (existReview.user_id != userId && existUser.role != UsersRole.superadmin && existUser.role != UsersRole.admin) {
      throw new BadRequestException("Faqat adminlar yoki baholagan user o'chira oladi ❗️");
    }

    const deletedReview = await this.prismaService.review.delete({
      where: { id },
      include: {
        house: true
      }
    });
    return {
      message: "Review deleted successfully 🗑️✅",
      data: deletedReview
    };
  }
}
