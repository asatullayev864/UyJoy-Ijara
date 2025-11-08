import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersRole } from '../common/enums';

@Injectable()
export class UsersService implements OnModuleInit {
  jwtService: any;
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async onModuleInit() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const name = process.env.SUPER_ADMIN_NAME || "Jorabek";
    const phone = process.env.SUPER_ADMIN_PHONE || "+998500406088";

    if (!email || !password) return;

    const existSuperAdmin = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existSuperAdmin) {
      const hashedPassword = await bcrypt.hash(password, 7);

      await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
          full_name: name,
          phone,
          refresh_token: '',
          is_active: true,
          role: UserRole.superadmin,
        },
      });

      console.log(`✅ Superadmin yaratildi: email: ${email} password: ${password}`);
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, phone, role } = createUserDto;
    if (role) {
      const existRole = role.toLowerCase();
      if (existRole !== UsersRole.admin && existRole !== UsersRole.client && existRole !== UsersRole.owner) {
        throw new BadRequestException("Iltimos role ni togri kiriting ❗️");
      }
    }
    const existEmail = await this.prismaService.user.findUnique({
      where: { email }
    });
    if (existEmail) throw new BadRequestException("Bunday email tarmoqda mavjud ❗️");

    const existPhone = await this.prismaService.user.findUnique({
      where: { phone }
    });
    if (existPhone) throw new BadRequestException("Bunday tel raqami tarmoqda mavjud ❗️");

    createUserDto.password = await bcrypt.hash(password, 7);
    const newUser = await this.prismaService.user.create({ data: { ...createUserDto } });
    return newUser;
  }

  async findAll() {
    const users = await this.prismaService.user.findMany({
      include: {
        profile: {
          select: {
            id: true,
            birth_date: true,
            gender: true,
            avatar_url: true
          }
        }
      }
    });
    return users;
  };

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            id: true,
            birth_date: true,
            gender: true,
            avatar_url: true
          }
        }
      }
    });
    if (!user) throw new NotFoundException("Bunday foydalanuvchi topilmadi ❌");
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, password, phone, role } = updateUserDto;
    if (email) {
      const existEmail = await this.prismaService.user.findUnique({
        where: { email }
      });
      if (existEmail && existEmail.id !== id) {
        throw new BadRequestException("Bunday email tarmoqda mavjud ❗️");
      }
    };

    if (password) {
      updateUserDto.password = await bcrypt.hash(password, 7);
    };

    if (phone) {
      const existPhone = await this.prismaService.user.findUnique({
        where: { phone }
      });
      if (existPhone && existPhone.id !== id) {
        throw new BadRequestException("Bunday tel raqami tarmoqda mavjud ❗️");
      }
    };

    if (role) {
      console.log('Roleni ozgartirmoqchi bolsangiz boshqa akkount oching ❗️');
      throw new BadRequestException('Roleni ozgartirish mumkin emas ❗️');
    }
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { ...updateUserDto }
    });
    return updatedUser;
  }

  async remove(id: number) {
    const userDeleted = await this.prismaService.user.delete({
      where: { id }
    });
    if (!userDeleted) throw new NotFoundException('Bunday foydalanuvchi topilmadi ❌');
    return userDeleted;
  }
}
