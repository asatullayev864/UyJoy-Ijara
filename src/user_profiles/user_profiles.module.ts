import { Module } from '@nestjs/common';
import { UserProfilesService } from './user_profiles.service';
import { UserProfilesController } from './user_profiles.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserProfilesController],
  providers: [UserProfilesService],
})
export class UserProfilesModule {}
