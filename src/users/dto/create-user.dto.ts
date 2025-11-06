import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UsersRole } from '../../common/enums';

export class CreateUserDto {
    @ApiProperty({ description: "Foydalanuvchi to'liq ismi", example: "Ali Valiev" })
    @IsString()
    full_name: string;

    @ApiProperty({ description: "Telefon raqam", example: "+998901234567" })
    @IsString()
    phone: string;

    @ApiProperty({ description: "Email manzil", example: "ali@gmail.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "Parol", example: "123456" })
    @IsString()
    password: string;

    @ApiPropertyOptional({ description: "Foydalanuvchi roli", enum: UsersRole, default: UsersRole.client })
    @IsOptional()
    @IsEnum(UsersRole)
    role?: UsersRole = UsersRole.client;
}