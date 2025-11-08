import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { AccessTokenGuard, JwtRoleGuard } from "../common/guards";
import { GetCurrentUserId, Roles } from "../common/decorators";
import { UsersRole } from "../common/enums";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from "@nestjs/swagger";

@ApiTags("Reports")
@ApiBearerAuth()
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Post()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.client)
  @ApiOperation({ summary: "Yangi shikoyat yaratish" })
  @ApiBody({ type: CreateReportDto })
  @ApiResponse({ status: 201, description: "Shikoyat muvaffaqiyatli yaratildi" })
  create(
    @GetCurrentUserId() userId: number,
    @Body() createReportDto: CreateReportDto
  ) {
    return this.reportsService.create(+userId, createReportDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: "Barcha shikoyatlarni olish (pagination bilan)" })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Sahifa raqami" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Sahifa limit" })
  @ApiResponse({ status: 200, description: "Shikoyatlar ro'yxati", type: Object })
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.reportsService.findAll(pageNumber, limitNumber);
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Bitta shikoyatni olish" })
  @ApiParam({ name: "id", description: "Shikoyat ID" })
  @ApiResponse({ status: 200, description: "Shikoyat ma'lumotlari", type: Object })
  @ApiResponse({ status: 404, description: "Shikoyat yoki user topilmadi" })
  findOne(
    @Param("id") id: string,
    @GetCurrentUserId() userId: number,
  ) {
    return this.reportsService.findOne(+userId, +id);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.client)
  @ApiOperation({ summary: "Shikoyatni yangilash" })
  @ApiParam({ name: "id", description: "Shikoyat ID" })
  @ApiBody({ type: UpdateReportDto })
  @ApiResponse({ status: 200, description: "Shikoyat muvaffaqiyatli yangilandi", type: Object })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q" })
  update(
    @GetCurrentUserId() userId: number,
    @Param("id") id: string,
    @Body() updateReportDto: UpdateReportDto
  ) {
    return this.reportsService.update(+userId, +id, updateReportDto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.client)
  @ApiOperation({ summary: "Shikoyatni o'chirish" })
  @ApiParam({ name: "id", description: "Shikoyat ID" })
  @ApiResponse({ status: 200, description: "Shikoyat muvaffaqiyatli o'chirildi", type: Object })
  @ApiResponse({ status: 403, description: "Ruxsat yo'q" })
  remove(
    @GetCurrentUserId() userId: number,
    @Param("id") id: string
  ) {
    return this.reportsService.remove(+userId, +id);
  }
}