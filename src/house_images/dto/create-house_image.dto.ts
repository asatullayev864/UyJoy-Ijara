import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHouseImageDto {
    @ApiProperty({ example: 1, description: 'Uy IDsi' })
    @IsInt()
    house_id: number;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Uy rasmi URL' })
    @IsString()
    image_url: string;
}