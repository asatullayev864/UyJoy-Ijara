import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user_profile.dto';
import { UpdateUserProfileDto } from './dto/update-user_profile.dto';
import { Gender, UsersRole } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
import { UserProfile } from '@prisma/client';

@Injectable()
export class UserProfilesService {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(createUserProfileDto: CreateUserProfileDto, userId: number): Promise<UserProfile> {
    const { gender } = createUserProfileDto;
    if (gender) {
      const existGender = gender.toLowerCase();
      if (existGender != Gender.male && existGender != Gender.female && existGender != Gender.other) {
        throw new BadRequestException("Iltimos jinsni togri kiriting ❗️");
      }
    }

    const newProfile = await this.prismaService.userProfile.create({
      data: {
        user_id: userId,
        ...createUserProfileDto,
        birth_date: createUserProfileDto.birth_date ? new Date(createUserProfileDto.birth_date) : undefined,
      }
    });
    return newProfile;
  }

  async findAll(): Promise<UserProfile[]> {
    const profiles = await this.prismaService.userProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            is_active: true,
            role: true
          }
        }
      }
    });
    return profiles;
  }

  async findOne(id: number): Promise<UserProfile> {
    const user = await this.prismaService.userProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            is_active: true,
            role: true
          }
        }
      }
    });

    if (!user) throw new NotFoundException("Bunday profil topilmadi ❌");

    return user;
  }

  async update(id: number, updateUserProfileDto: UpdateUserProfileDto, userId: number): Promise<UserProfile> {
    const { gender, birth_date } = updateUserProfileDto;

    const userProfil = await this.prismaService.userProfile.findUnique({ where: { id } });

    if (!userProfil) throw new NotFoundException("Bunday profil topilmadi ❌");

    if (userProfil.user_id != userId) throw new BadRequestException("Faqat ozingizni profilingizni ozgartira olasiz ❗️");

    if (gender) {
      const existGender = gender.toLowerCase();
      if (
        existGender != Gender.male &&
        existGender != Gender.female &&
        existGender != Gender.other
      ) {
        throw new BadRequestException("Iltimos jinsni tog'ri kiriting ❗️");
      }
    }

    let birth;
    if (birth_date) {
      birth = new Date(birth_date);
    }

    const updatedProfile = await this.prismaService.userProfile.update({
      where: { id },
      data: {
        ...updateUserProfileDto,
        birth_date: birth
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            role: true,
            is_active: true
          }
        }
      }
    });

    return updatedProfile;
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const profile = await this.prismaService.userProfile.findUnique({
      where: { id }
    });

    if (!profile) throw new NotFoundException("Bunday profil topilmadi ❌");

    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    });

    if (user.role != UsersRole.superadmin && user.role != UsersRole.admin && profile.user_id != userId) {
      throw new BadRequestException("Siz faqat ozingizni profilingizni o'chirishingiz mumkin ❗️");
    }

    await this.prismaService.userProfile.delete({
      where: { id }
    });

    return {
      message: "Profile muvaffaqiyatli o'chirildi 🗑️✅"
    };
  }
}
