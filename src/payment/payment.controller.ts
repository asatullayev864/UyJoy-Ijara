import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AccessTokenGuard, JwtRoleGuard } from '../common/guards';
import { GetCurrentUserId, Roles } from '../common/decorators';
import { GetCurrentUserRole } from '../common/decorators/get-current-user-role.decorator';
import { UsersRole } from '../common/enums';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody
} from '@nestjs/swagger';
import { PaymentResponseDto } from './dto/payment-reponse.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.client)
  @ApiOperation({ summary: "To'lov yaratish" })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: "To'lov muvaffaqiyatli yaratildi", type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: "Xatolik, to'lov yaratilmaydi" })
  create(
    @GetCurrentUserId() userId: number,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    return this.paymentService.create(+userId, createPaymentDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: "Barcha to'lovlarni olish (faqat adminlar)" })
  @ApiResponse({ status: 200, description: "To'lovlar ro'yxati", type: [PaymentResponseDto] })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('my')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.client, UsersRole.admin, UsersRole.superadmin)
  @ApiOperation({ summary: "Foydalanuvchining o'z to'lovlarini olish" })
  @ApiResponse({ status: 200, description: "Foydalanuvchining to'lovlari", type: [PaymentResponseDto] })
  findMyPayments(@GetCurrentUserId() userId: number) {
    return this.paymentService.findMyPayments(+userId);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Bitta to'lovni olish" })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: "Topilgan to'lov", type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: "Bunday to'lov topilmadi" })
  findOne(
    @GetCurrentUserId() userId: number,
    @Param('id') id: string
  ) {
    return this.paymentService.findOne(+userId, +id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: "To'lov holatini yangilash (faqat adminlar)" })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({ status: 200, description: "Payment yangilandi", type: PaymentResponseDto })
  update(
    @GetCurrentUserRole() userRole: string,
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentService.update(+id, updatePaymentDto, userRole);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: "To'lovni o'chirish (faqat adminlar)" })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: "Payment o'chirildi", type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: "Bunday to'lov topilmadi" })
  remove(
    @GetCurrentUserRole() userRole: string,
    @Param('id') id: string
  ) {
    return this.paymentService.remove(+id, userRole);
  }
}

