import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { HouseDetailsService } from "./house_details.service";
import { AccessTokenGuard, JwtRoleGuard } from "../common/guards";
import { OwnerOrAdminGuard } from "../common/guards/owner-or-admin.guard";
import { CreateHouseDetailDto } from "./dto/create-house_detail.dto";
import { Roles } from "../common/decorators";
import { UsersRole } from "../common/enums";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { HouseDetailResponseDto } from "./dto/house-detail-response.dto";

@ApiTags('HouseDetails')
@ApiBearerAuth()
@Controller("houses/:house_id/details")
export class HouseDetailsController {
  constructor(private readonly houseDetailsService: HouseDetailsService) { }

  @Post()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  @ApiOperation({ summary: "Uy detalini yaratish (faqat owner/admin)" })
  @ApiParam({ name: "house_id", type: Number, description: "Uy IDsi" })
  @ApiBody({ type: CreateHouseDetailDto })
  @ApiResponse({ status: 201, description: "Uy detali yaratildi", type: HouseDetailResponseDto })
  create(@Param("house_id") houseId: string, @Body() dto: CreateHouseDetailDto) {
    return this.houseDetailsService.create(+houseId, dto);
  }

  @Get("/all")
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.admin, UsersRole.superadmin)
  @ApiOperation({ summary: "Barcha uy detallarini olish (faqat admin/superadmin)" })
  @ApiResponse({ status: 200, description: "Uy detallari ro'yxati", type: [HouseDetailResponseDto] })
  findAll() {
    return this.houseDetailsService.findAll();
  }

  @Get()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  @ApiOperation({ summary: "Bir uy detalini olish (faqat owner/admin)" })
  @ApiParam({ name: "house_id", type: Number, description: "Uy IDsi" })
  @ApiResponse({ status: 200, description: "Uy detali", type: HouseDetailResponseDto })
  findOne(@Param("house_id") houseId: string) {
    return this.houseDetailsService.findOne(+houseId);
  }

  @Patch()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  @ApiOperation({ summary: "Uy detalini yangilash (faqat owner/admin)" })
  @ApiParam({ name: "house_id", type: Number, description: "Uy IDsi" })
  @ApiBody({ type: CreateHouseDetailDto })
  @ApiResponse({ status: 200, description: "Uy detali yangilandi", type: HouseDetailResponseDto })
  update(
    @Param("house_id") houseId: string, @Body() dto: Partial<CreateHouseDetailDto>
  ) {
    return this.houseDetailsService.update(+houseId, dto);
  }

  @Delete()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  @ApiOperation({ summary: "Uy detalini o'chirish (faqat owner/admin)" })
  @ApiParam({ name: "house_id", type: Number, description: "Uy IDsi" })
  @ApiResponse({ status: 200, description: "Uy detali o'chirildi" })
  remove(@Param("house_id") houseId: string) {
    return this.houseDetailsService.remove(+houseId);
  }
}