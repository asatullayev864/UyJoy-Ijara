import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({ description: 'Email manzil', example: 'ali@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Parol', example: '123456' })
    @IsString()
    password: string;
}