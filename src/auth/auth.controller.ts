import { Controller, Post, Body, Res, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CookieGetter } from '../common/decorators/roles.decorator';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { SignInDto } from '../users/dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshTokenGuard } from '../common/guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService
  ) { }

  @Post('signup')
  @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqiyatli yaratildi ✅',
    schema: {
      example: {
        message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
        user: {
          id: 1,
          full_name: "Ali Valiev",
          email: "ali@gmail.com",
          role: "client"
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: "Email allaqachon mavjud yoki noto'g'ri ma'lumot kiritildi",
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }


  @Post('signin')
  @ApiOperation({ summary: 'Foydalanuvchi tizimga kirishi' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200, description: 'Tizimga muvaffaqiyatli kirildi',
    schema: {
      example: { message: 'Tizimga muvaffaqiyatli kirdingiz', accessToken: 'jwt-token' }
    }
  })
  @ApiResponse({ status: 401, description: "Email yoki password noto'g'ri" })
  async login(
    @Body() loginUserDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(loginUserDto, res);
  }

  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  @Post("signout")
  @ApiOperation({ summary: 'Foydalanuvchi tizimdan chiqish' })
  @ApiResponse({
    status: 200,
    description: 'Tizimda muvaffaqiyatli chiqildi',
    schema: {
      example: {
        message: 'Siz tizimdan muvaffaqiyatli chiqdingiz✅'
      }
    }
  })
  logout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(+userId, res);
  }

  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Tokenni yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Token muvaffaqiyatli yangilandi',
    schema: {
      example: {
        message: 'Token muvaffaqiyatli yangilandi ✅',
        accessToken: 'yangi-access-token',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Token mos emas yoki yaroqsiz' })
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(+userId, refreshToken, res);
  }
}