import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { AccessTokenGuard, JwtRoleGuard } from '../common/guards';
import { GetCurrentUserId, Roles } from '../common/decorators';
import { UsersRole } from '../common/enums';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SelfRoleGuard } from '../common/guards/self-role.guard';

@ApiTags('House')
@ApiBearerAuth()
@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) { }

  @Post()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin, UsersRole.owner)
  @ApiOperation({ summary: 'Yangi uy yaratish (faqat admin, superadmin va owner)' })
  create(
    @GetCurrentUserId() userId: number,
    @Body() createHouseDto: CreateHouseDto
  ) {
    return this.houseService.create(createHouseDto, +userId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Tasdiqlangan barcha uylarni olish' })
  findAll() {
    return this.houseService.findAll();
  }

  @Get('province/:province')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Viloyat bo'yicha uylarni qidirish" })
  @ApiParam({ name: 'province', example: 'Toshkent' })
  findByProvince(
    @Param('province') province: string
  ) {
    return this.houseService.findByProvince(province);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Bitta uy haqida ma’lumot olish' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.houseService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin, UsersRole.owner)
  @ApiOperation({ summary: 'Uy ma’lumotlarini yangilash' })
  @ApiParam({ name: 'id', example: 1 })
  update(
    @GetCurrentUserId() userId: number,
    @Param('id') id: string,
    @Body() updateHouseDto: UpdateHouseDto
  ) {
    return this.houseService.update(+id, updateHouseDto, +userId);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin, UsersRole.owner)
  @ApiOperation({ summary: "Uy o'chirish" })
  @ApiParam({ name: 'id', example: 1 })
  remove(
    @GetCurrentUserId() userId: number,
    @Param('id') id: string
  ) {
    return this.houseService.remove(+id, +userId);
  }
}
