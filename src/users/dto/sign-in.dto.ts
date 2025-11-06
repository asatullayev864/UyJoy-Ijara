import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class SignInDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}