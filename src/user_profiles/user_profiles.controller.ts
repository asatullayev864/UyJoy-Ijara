import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user_profile.dto';
import { UpdateUserProfileDto } from './dto/update-user_profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UserProfilesService } from './user_profiles.service';
import { AccessTokenGuard, JwtAuthGuard, SelfGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorators';
import { SelfRoleGuard } from '../common/guards/self-role.guard';

@ApiTags('UserProfiles')
@ApiBearerAuth()
@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Yangi foydalanuvchi profile yaratish' })
  @ApiBody({ type: CreateUserProfileDto })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi profile yaratildi',
    schema: {
      example: {
        message: 'Profile muvaffaqiyatli yaratildi',
        profile: {
          id: 1,
          user_id: 1,
          birth_date: '2000-01-01',
          gender: 'male',
          avatar_url: 'https://example.com/avatar.jpg',
          address: 'Toshkent, Chilonzor',
          is_verified: false
        }
      }
    }
  })
  create(
    @GetCurrentUserId() userId: number,
    @Body() createUserProfileDto: CreateUserProfileDto
  ) {
    return this.userProfilesService.create(createUserProfileDto, +userId);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Barcha foydalanuvchi profillarini olish' })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi profillari ro'yxati",
    schema: {
      example: [
        {
          id: 1,
          user_id: 1,
          birth_date: '2000-01-01',
          gender: 'male',
          avatar_url: 'https://example.com/avatar.jpg',
          address: 'Toshkent, Chilonzor',
          is_verified: false
        }
      ]
    }
  })
  findAll() {
    return this.userProfilesService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Bitta foydalanuvchi profilini olish' })
  @ApiParam({ name: 'id', type: Number, description: 'UserProfile ID' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi profili topildi',
    schema: {
      example: {
        id: 1,
        user_id: 1,
        birth_date: '2000-01-01',
        gender: 'male',
        avatar_url: 'https://example.com/avatar.jpg',
        address: 'Toshkent, Chilonzor',
        is_verified: false
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Profile topilmadi' })
  findOne(@Param('id') id: string) {
    return this.userProfilesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, SelfGuard)
  @ApiOperation({ summary: 'Foydalanuvchi profilini yangilash' })
  @ApiParam({ name: 'id', type: Number, description: 'UserProfile ID' })
  @ApiBody({ type: UpdateUserProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi profili muvaffaqiyatli yangilandi',
    schema: {
      example: {
        message: 'Profile yangilandi',
        profile: {
          id: 1,
          user_id: 1,
          birth_date: '2000-01-01',
          gender: 'female',
          avatar_url: 'https://example.com/avatar2.jpg',
          address: 'Toshkent, Mirzo Ulugbek',
          is_verified: true
        }
      }
    }
  })
  update(
    @GetCurrentUserId() userId: number,
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto) {
    return this.userProfilesService.update(+id, updateUserProfileDto, +userId);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, SelfRoleGuard)
  @ApiOperation({ summary: "Foydalanuvchi profilini o'chirish" })
  @ApiParam({ name: "id", type: Number, description: "UserProfile ID" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi profili muvaffaqiyatli o'chirildi",
    schema: {
      example: { message: "Profile o'chirildi" }
    }
  })
  @ApiResponse({ status: 404, description: "Profile topilmadi" })
  remove(
    @GetCurrentUserId() userId: number,
    @Param("id") id: string
  ) {
    return this.userProfilesService.remove(+id, +userId);
  }
}