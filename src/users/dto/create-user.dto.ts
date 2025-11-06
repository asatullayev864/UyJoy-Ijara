import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UsersRole } from '../../common/enums';

export class CreateUserDto {
    @IsString()
    full_name: string;

    @IsString()
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(UsersRole)
    role?: UsersRole = UsersRole.client;
}