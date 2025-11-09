import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RentalTimesService } from "./rental_times.service";
import { CreateRentalTimeDto } from "./dto/create-rental_time.dto";
import { UpdateRentalTimeDto } from "./dto/update-rental_time.dto";
import { AccessTokenGuard, JwtRoleGuard } from "../common/guards";
import { GetCurrentUserId, Roles } from "../common/decorators";
import { UsersRole } from "../common/enums";

@ApiTags("Rental Times")
@ApiBearerAuth()
@Controller("rental-times")
export class RentalTimesController {
  constructor(private readonly rentalTimesService: RentalTimesService) { }

  @Post()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.client, UsersRole.superadmin)
  @ApiOperation({ summary: "Yangi rental time yaratish (client yoki superadmin uchun)" })
  @ApiResponse({ status: 201, description: "Rental time muvaffaqiyatli yaratildi ✅" })
  @ApiResponse({ status: 403, description: "Foydalanuvchida ruxsat yo'q ❌" })
  create(
    @GetCurrentUserId() userId: number,
    @Body() createRentalTimeDto: CreateRentalTimeDto
  ) {
    return this.rentalTimesService.create(+userId, createRentalTimeDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin)
  @ApiOperation({ summary: "Barcha rental time larni olish (faqat superadmin)" })
  @ApiResponse({ status: 200, description: "Barcha rental time lar ro'yxati qaytdi ✅" })
  findAll() {
    return this.rentalTimesService.findAll();
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "ID orqali rental time ni olish" })
  @ApiResponse({ status: 200, description: "Topilgan rental time qaytarildi ✅" })
  @ApiResponse({ status: 404, description: "Bunday rental time topilmadi ❌" })
  findOne(
    @GetCurrentUserId() userId: number,
    @Param("id") id: string
  ) {
    return this.rentalTimesService.findOne(+userId, +id);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.client)
  @ApiOperation({ summary: "Rental time ni yangilash (client yoki superadmin)" })
  @ApiResponse({ status: 200, description: "Rental time muvaffaqiyatli yangilandi 🔄✅" })
  @ApiResponse({ status: 403, description: "Foydalanuvchida ruxsat yo'q ❌" })
  update(
    @GetCurrentUserId() userId: number,
    @Param("id") id: string,
    @Body() updateRentalTimeDto: UpdateRentalTimeDto
  ) {
    return this.rentalTimesService.update(+userId, +id, updateRentalTimeDto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.client)
  @ApiOperation({ summary: "Rental time ni o'chirish (client yoki superadmin)" })
  @ApiResponse({ status: 200, description: "Rental time muvaffaqiyatli o'chirildi 🗑️✅" })
  @ApiResponse({ status: 403, description: "Foydalanuvchida ruxsat yo'q ❌" })
  remove(
    @GetCurrentUserId() userId: number,
    @Param("id") id: string
  ) {
    return this.rentalTimesService.remove(+userId, +id);
  }
}
