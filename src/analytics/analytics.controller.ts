import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AccessTokenGuard, JwtRoleGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { UsersRole } from '../common/enums';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('top-houses')
  @UseGuards(AccessTokenGuard)
  getTopHouses() {
    return this.analyticsService.getTopHouses();
  }

  @Get('house-incomes')
  @UseGuards(AccessTokenGuard, JwtRoleGuard)
  @Roles(UsersRole.superadmin, UsersRole.admin)
  getHouseIncomes() {
    return this.analyticsService.getHouseIncomes();
  }

  @Get('user-stats')
  @UseGuards(AccessTokenGuard)
  getUserStats() {
    return this.analyticsService.getUserStats();
  }

  @Get('house-ratings')
  @UseGuards(AccessTokenGuard)
  getHouseRatings() {
    return this.analyticsService.getHouseRatings();
  }
}