import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { HouseFacilitiesService } from "./house_facilities.service";
import { CreateHouseFacilityDto } from "./dto/create-house_facility.dto";
import { UpdateHouseFacilityDto } from "./dto/update-house_facility.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AccessTokenGuard } from "../common/guards";
import { OwnerOrAdminGuard } from "../common/guards/owner-or-admin.guard";
import { HouseFacilityResponse } from "./dto/house_facility.response";

@ApiTags("Facilities")
@ApiBearerAuth()
@Controller("house-facilities")
export class HouseFacilitiesController {
  constructor(private readonly houseFacilitiesService: HouseFacilitiesService) { }

  @Post()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  @ApiOperation({ summary: "Uyga qulaylik qo'shish" })
  @ApiBody({ type: CreateHouseFacilityDto })
  @ApiResponse({
    status: 201,
    description: "Uyga qulaylik muvaffaqiyatli qo'shildi",
    type: HouseFacilityResponse,
  })
  create(@Body() dto: CreateHouseFacilityDto) {
    return this.houseFacilitiesService.create(dto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Barcha uy qulayliklarini olish" })
  @ApiResponse({
    status: 200,
    description: "Uy qulayliklari ro'yxati",
    type: [HouseFacilityResponse],
  })
  findAll() {
    return this.houseFacilitiesService.findAll();
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Bitta uy qulayligini olish" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Qulaylik ID raqami",
  })
  @ApiResponse({
    status: 200,
    description: "Qulaylik ma'lumoti",
    type: HouseFacilityResponse,
  })
  findOne(@Param("id") id: string) {
    return this.houseFacilitiesService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  @ApiOperation({ summary: "Uy qulayligini yangilash" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Qulaylik ID raqami",
  })
  @ApiBody({ type: UpdateHouseFacilityDto })
  @ApiResponse({
    status: 200,
    description: "Qulaylik muvaffaqiyatli yangilandi",
    type: HouseFacilityResponse,
  })
  update(@Param("id") id: string, @Body() dto: UpdateHouseFacilityDto) {
    return this.houseFacilitiesService.update(+id, dto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard)
  @ApiOperation({ summary: "Uy qulayligini o'chirish" })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Qulaylik ID raqami",
  })
  @ApiResponse({
    status: 200,
    description: "Qulaylik muvaffaqiyatli o'chirildi",
  })
  remove(@Param("id") id: string) {
    return this.houseFacilitiesService.remove(+id);
  }
}