import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { AccessTokenGuard } from "../common/guards";
import { GetCurrentUserId } from "../common/decorators";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@ApiTags("Reviews")
@ApiBearerAuth()
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Uyga review qo'shish" })
  @ApiResponse({ status: 201, description: "Review muvaffaqiyatli yaratildi ✅" })
  @ApiResponse({ status: 404, description: "User yoki uy topilmadi ❌" })
  create(
    @GetCurrentUserId() userId: number,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewsService.create(+userId, createReviewDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Barcha reviewlarni olish" })
  @ApiResponse({ status: 200, description: "Reviewlar ro'yxati" })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get("house/:houseId")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Ma'lum bir uyning reviewlarini olish" })
  @ApiResponse({ status: 200, description: "Uyning reviewlari qaytarildi ✅" })
  @ApiResponse({ status: 404, description: "Uy uchun reviewlar topilmadi ❌" })
  findHouse(
    @Param("houseId") houseId: string
  ) {
    return this.reviewsService.findHouse(+houseId);
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Bitta reviewni olish" })
  @ApiResponse({ status: 200, description: "Review topildi ✅" })
  @ApiResponse({ status: 404, description: "Review topilmadi ❌" })
  findOne(
    @Param("id") id: string
  ) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Reviewni yangilash" })
  @ApiResponse({ status: 200, description: "Review muvaffaqiyatli yangilandi ✅" })
  @ApiResponse({ status: 403, description: "Faqat review egasi o'zgartira oladi ❌" })
  update(
    @GetCurrentUserId() userId: number,
    @Param("id") id: string,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewsService.update(+userId, +id, updateReviewDto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Reviewni o'chirish" })
  @ApiResponse({ status: 200, description: "Review muvaffaqiyatli o'chirildi 🗑️✅" })
  @ApiResponse({ status: 403, description: "Faqat admin yoki review egasi o'chira oladi ❌" })
  remove(
    @GetCurrentUserId() userId: number,
    @Param("id") id: string
  ) {
    return this.reviewsService.remove(+userId, +id);
  }
}