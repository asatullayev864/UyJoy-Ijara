import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from '../users/dto/sign-in.dto';
import type { Response } from 'express';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";
import { Tokens } from '../common/types';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly userService: UsersService
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

    async signUp(createUserDto: CreateUserDto) {
        const newUser = await this.userService.create(createUserDto);
        return newUser;
    };

    async signIn(signIn: SignInDto, res: Response) {
        const { email, password } = signIn;

        const existEmail = await this.prismaService.user.findUnique({
            where: { email }
        });
        if (!existEmail) throw new NotFoundException("Email yoki parol da hatolik ‼️");

        const existsPass = await bcrypt.compare(password, existEmail.password);
        if (!existsPass) throw new NotFoundException("Email yoki parol da hatolik ‼️");

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
