import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
    @ApiProperty({
        description: 'ID of the house to add to favorites',
        example: 123
    })
    @IsInt({ message: 'house_id must be an integer' })
    @IsNotEmpty({ message: 'house_id is required' })
    house_id: number;
}