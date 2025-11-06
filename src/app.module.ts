import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserProfilesModule } from './user_profiles/user_profiles.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    AuthModule,
    UsersModule,
    UserProfilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
