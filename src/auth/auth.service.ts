import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from '../users/dto/sign-in.dto';
import type { Response } from 'express';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";
import { Tokens } from '../common/types';
import { randomInt } from 'crypto';
import { MailService } from '../mail/mail.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly userService: UsersService,
        private readonly mailService: MailService,
    ) { }

    private async generateTokens(user: any) {
        const payload = {
            id: user.id,
            email: user.email,
            is_active: user.is_active,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.ACCESS_TOKEN_KEY!,
            expiresIn: '24h' as const,
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_KEY!,
            expiresIn: '30d' as const,
        });

        return { accessToken, refreshToken };
    };

    private generateOTP(): string {
        return randomInt(100000, 999999).toString();
    }

    async signUp(createUserDto: CreateUserDto) {
        const otp = this.generateOTP();
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000);


        const newUser = await this.userService.create(createUserDto, otp, otpExpire);
        await this.mailService.sendOTP(newUser.email, otp);

        return {
            message: "Ro'yxatdan o'tish muvaffaqiyatli, emailingizga OTP yuborildi ✅",
            email: newUser.email
        };
    };

    async confirmOtp(email: string, otp: string) {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException("Foydalanuvchi topilmadi ❌");

        if (!user.otp || !user.otp_expire || user.otp_expire < new Date()) {
            throw new BadRequestException('OTP muddati tugagan yoki topilmadi ❌');
        }

        if (user.otp !== otp) {
            throw new BadRequestException("OTP noto'g'ri ❌");
        };

        await this.prismaService.user.update({
            where: { email },
            data: {
                is_active: true,
                otp: null,
                otp_expire: null
            }
        });

        return {
            message: "Email tasdiqlandi, endi tizimga kira olasiz ✅"
        };
    }

    async signIn(signIn: SignInDto, res: Response) {
        const { email, password } = signIn;

        const existEmail = await this.prismaService.user.findUnique({
            where: { email }
        });
        if (!existEmail) throw new NotFoundException("Email yoki parol da hatolik ‼️");

        const existsPass = await bcrypt.compare(password, existEmail.password);
        if (!existsPass) throw new NotFoundException("Email yoki parol da hatolik ‼️");

        if (existEmail.is_active != true) {
            throw new BadRequestException("Siz activ foydalanuvchi emassiz ❗️");
        }
        const { accessToken, refreshToken } = await this.generateTokens(existEmail);

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
        existEmail.refresh_token = hashedRefreshToken;
        await this.prismaService.user.update({
            where: { email },
            data: { refresh_token: hashedRefreshToken }
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true,
        });

        return {
            message: "Tizimga muvaffaqiyatli kirdinggiz",
            role: existEmail.role,
            accessToken
        };
    };

    async signOut(userId: number, res: Response) {
        const user = await this.prismaService.user.update({
            where: { id: userId },
            data: {
                refresh_token: null
            }
        });
        if (!user) {
            throw new BadRequestException("Foydalanuvchi topilmadi ❌");
        }

        res.clearCookie('refreshToken');

        return {
            message: 'User logged out successfully ✅'
        };
    };

    async refreshToken(userId: number, refreshToken: string, res: Response) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        });
        if (!user || !user.refresh_token) {
            throw new UnauthorizedException('Foydalanuvchi topilmadi');
        }

        const isMatches = await bcrypt.compare(refreshToken, user.refresh_token);
        if (!isMatches) {
            throw new ForbiddenException('Yaroqsiz token');
        }

        const tokens: Tokens = await this.generateTokens(user);
        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);

        await this.prismaService.user.update({
            where: { id: user.id },
            data: { refresh_token: hashedRefreshToken }
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: Number(process.env.COOKIE_TIME),
            httpOnly: true
        });

        return {
            message: `Access token yangilandi ✅`,
            userId: userId,
            accessToken: tokens.accessToken
        }
    };
}
