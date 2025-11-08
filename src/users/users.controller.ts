import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { AccessTokenGuard, JwtRoleGuard, SelfGuard } from "../common/guards";
import { Roles } from "../common/decorators";
import { UsersRole } from "../common/enums";
import { SelfRoleGuard } from "../common/guards/self-role.guard";

@ApiTags("Users") // Swagger menuga nom berish
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: "Barcha foydalanuvchilarni olish" })
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchilar ro'yxati",
    schema: {
      example: [
        {
          id: 1,
          full_name: "Ali Valiev",
          email: "ali@gmail.com",
          role: "client",
          is_active: true
        }
      ]
    }
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard, SelfRoleGuard)
  @ApiOperation({ summary: "Bitta foydalanuvchini ID bo'yicha olish" })
  @ApiParam({ name: "id", type: Number, description: "Foydalanuvchi ID" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi topildi",
    schema: {
      example: {
        id: 1,
        full_name: "Ali Valiev",
        email: "ali@gmail.com",
        role: "client",
        is_active: true
      }
    }
  })
  @ApiResponse({ status: 404, description: "Foydalanuvchi topilmadi" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard, SelfGuard)
  @ApiOperation({ summary: "Foydalanuvchini yangilash" })
  @ApiParam({ name: "id", type: Number, description: "Foydalanuvchi ID" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi muvaffaqiyatli yangilandi",
    schema: {
      example: {
        message: "Foydalanuvchi yangilandi",
        user: {
          id: 1,
          full_name: "Ali Valiev",
          email: "ali@gmail.com",
          role: "client",
          is_active: true
        }
      }
    }
  })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard, SelfRoleGuard)
  @ApiOperation({ summary: "Foydalanuvchini o'chirish" })
  @ApiParam({ name: "id", type: Number, description: "Foydalanuvchi ID" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchi muvaffaqiyatli o'chirildi",
    schema: {
      example: { message: "Foydalanuvchi o'chirildi" }
    }
  })
  @ApiResponse({ status: 404, description: "Foydalanuvchi topilmadi" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}