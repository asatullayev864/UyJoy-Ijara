import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserProfilesModule } from './user_profiles/user_profiles.module';
import { HouseModule } from './house/house.module';
import { HouseDetailsModule } from './house_details/house_details.module';
import { HouseImagesModule } from './house_images/house_images.module';
import { HouseFacilitiesModule } from './house_facilities/house_facilities.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReportsModule } from './reports/reports.module';
import { RentalTimesModule } from './rental_times/rental_times.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentModule } from './payment/payment.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    AuthModule,
    UsersModule,
    UserProfilesModule,
    HouseModule,
    HouseDetailsModule,
    HouseImagesModule,
    HouseFacilitiesModule,
    FavoritesModule,
    ReviewsModule,
    ReportsModule,
    RentalTimesModule,
    BookingsModule,
    PaymentModule,
    AnalyticsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
