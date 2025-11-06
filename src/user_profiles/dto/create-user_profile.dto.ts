import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateUserProfileDto {
    @ApiPropertyOptional({ description: "Foydalanuvchi tug'ilgan sanasi", example: "2000-01-01" })
    @IsOptional()
    @IsDateString()
    birth_date?: string;

    @ApiPropertyOptional({ description: "Jinsi", enum: Gender, example: Gender.male })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ description: "Avatar URL", example: "https://example.com/avatar.jpg" })
    @IsOptional()
    @IsString()
    avatar_url?: string;

    @ApiPropertyOptional({ description: "Manzil", example: "Toshkent, Chilonzor" })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ description: "Tasdiqlanganligi", example: false })
    @IsOptional()
    @IsBoolean()
    is_verified?: boolean;
}