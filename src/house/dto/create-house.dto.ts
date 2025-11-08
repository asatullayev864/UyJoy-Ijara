import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';
import { UzbekistanRegion } from '../../common/enums';

export class CreateHouseDto {
    @ApiProperty({
        description: 'House title',
        example: 'Cozy apartment in city center',
    })
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MaxLength(255, { message: 'Title can be at most 255 characters' })
    title: string;

    @ApiProperty({
        description: 'House description',
        example: 'A beautiful 2-bedroom apartment near the park.',
    })
    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    @MaxLength(1000, { message: 'Description can be at most 1000 characters' })
    description: string;

    @ApiProperty({
        description: 'House address',
        example: '123 Main Street, Apartment 45',
    })
    @IsString()
    @IsNotEmpty({ message: 'Address is required' })
    @MaxLength(500, { message: 'Address can be at most 500 characters' })
    address: string;

    @ApiProperty({
        description: 'City where the house is located',
        example: 'Tashkent',
    })
    @IsEnum(UzbekistanRegion, { message: 'Faqat ozbekiston viloyatlaridan kiritishingiz kerak ❗️' })
    @IsNotEmpty({ message: 'City is required' })
    province: UzbekistanRegion;
}