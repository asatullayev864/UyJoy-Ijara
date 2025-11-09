import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AccessTokenGuard, JwtRoleGuard } from '../common/guards';
import { GetCurrentUserId, Roles } from '../common/decorators';
import { UsersRole } from '../common/enums';
import { GetCurrentUserRole } from '../common/decorators/get-current-user-role.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.client)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created successfully.' })
  create(
    @GetCurrentUserId() userId: number,
    @Body() createBookingDto: CreateBookingDto
  ) {
    return this.bookingsService.create(+userId, createBookingDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: 'Get all bookings (admin only)' })
  @ApiResponse({ status: 200, description: 'List of bookings.' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Booking found.' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({ status: 200, description: 'Booking updated successfully.' })
  update(
    @GetCurrentUserId() userId: number,
    @GetCurrentUserRole() userRole: string,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto
  ) {
    return this.bookingsService.update(+userId, +id, updateBookingDto, userRole);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }

  @Get('client/me')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get bookings for the current client' })
  @ApiResponse({ status: 200, description: 'List of client bookings.' })
  clientBookings(@GetCurrentUserId() userId: number) {
    return this.bookingsService.findByClient(+userId);
  }

  @Get('house/:houseId')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: 'Get all bookings for a specific house' })
  @ApiParam({ name: 'houseId', type: Number })
  findByHouse(@Param('houseId') houseId: string) {
    return this.bookingsService.findByHouse(+houseId);
  }

  @Get('status/:status')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: 'Get bookings by status' })
  @ApiParam({ name: 'status', type: String })
  findByStatus(@Param('status') status: string) {
    return this.bookingsService.findByStatus(status);
  }

  @Get('start-date/:startDate')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  @ApiOperation({ summary: 'Get bookings by start date' })
  @ApiParam({ name: 'startDate', type: String })
  findByStartDate(@Param('startDate') startDate: string) {
    return this.bookingsService.findByStartDate(startDate);
  }
}