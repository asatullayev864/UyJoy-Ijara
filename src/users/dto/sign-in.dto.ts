import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({ description: 'Email manzil', example: 'jorabekasatullayev61@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Parol', example: '2468Pa$w0rd' })
    @IsString()
    password: string;
}