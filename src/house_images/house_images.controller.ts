import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HouseImagesService } from './house_images.service';
import { CreateHouseImageDto } from './dto/create-house_image.dto';
import { UpdateHouseImageDto } from './dto/update-house_image.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards';
import { OwnerOrAdminGuard } from '../common/guards/owner-or-admin.guard';

@ApiTags('Images')
@ApiBearerAuth()
@Controller('house-images')
export class HouseImagesController {
  constructor(private readonly houseImagesService: HouseImagesService) { }

  @Post()
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard) // superadmin, admin yoki owner ning ozi yarata oladi
  @ApiOperation({ summary: 'Uy rasmi yaratish' })
  @ApiBody({ type: CreateHouseImageDto })
  @ApiResponse({ status: 201, description: 'Uy rasmi yaratildi', type: CreateHouseImageDto })
  create(@Body() createHouseImageDto: CreateHouseImageDto) {
    return this.houseImagesService.create(createHouseImageDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Barcha uy rasmlarini olish' })
  @ApiResponse({ status: 200, description: "Uy rasmlari ro'yxati", type: [CreateHouseImageDto] })
  findAll() {
    return this.houseImagesService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Bitta uy rasmini olish' })
  @ApiParam({ name: 'id', type: Number, description: 'Uy rasmi IDsi' })
  @ApiResponse({ status: 200, description: 'Uy rasmi', type: CreateHouseImageDto })
  findOne(@Param('id') id: string) {
    return this.houseImagesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard) // superadmin, admin yoki owner ning ozi ozgartira oladi
  @ApiOperation({ summary: 'Uy rasmini yangilash' })
  @ApiParam({ name: 'id', type: Number, description: 'Uy rasmi IDsi' })
  @ApiBody({ type: UpdateHouseImageDto })
  @ApiResponse({ status: 200, description: 'Uy rasmi yangilandi', type: UpdateHouseImageDto })
  update(@Param('id') id: string, @Body() updateHouseImageDto: UpdateHouseImageDto) {
    return this.houseImagesService.update(+id, updateHouseImageDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, OwnerOrAdminGuard) // superadmin, admin yoki owner ning ozi o'chira oladi
  @ApiOperation({ summary: "Uy rasmini o'chirish" })
  @ApiParam({ name: 'id', type: Number, description: 'Uy rasmi IDsi' })
  @ApiResponse({ status: 200, description: "Uy rasmi o'chirildi" })
  remove(@Param('id') id: string) {
    return this.houseImagesService.remove(+id);
  }
}
