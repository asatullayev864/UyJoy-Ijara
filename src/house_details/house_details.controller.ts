import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { HouseDetailsService } from "./house_details.service";
import { AccessTokenGuard, JwtRoleGuard } from "../common/guards";
import { OwnerOrAdminGuard } from "../common/guards/owner-or-admin.guard";
import { CreateHouseDetailDto } from "./dto/create-house_detail.dto";
import { Roles } from "../common/decorators";
import { UsersRole } from "../common/enums";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@ApiBearerAuth()
@Controller("houses/:house_id/details")
export class HouseDetailsController {
  constructor(private readonly houseDetailsService: HouseDetailsService) { }

  @Post()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  create(@Param("house_id") houseId: string, @Body() dto: CreateHouseDetailDto) {
    return this.houseDetailsService.create(+houseId, dto);
  }

  @Get("/all")
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.admin, UsersRole.superadmin)
  @ApiOperation({ summary: "Barcha uy detallarini olish (faqat admin/superadmin)" })
  findAll() {
    return this.houseDetailsService.findAll();
  }

  @Get()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  findOne(
    @Param("house_id") houseId: string
  ) {
    return this.houseDetailsService.findOne(+houseId);
  }

  @Patch()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  update(
    @Param("house_id") houseId: string,
    @Body() dto: Partial<CreateHouseDetailDto>
  ) {
    return this.houseDetailsService.update(+houseId, dto);
  }

  @Delete()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  remove(@Param("house_id") houseId: string) {
    return this.houseDetailsService.remove(+houseId);
  }
}