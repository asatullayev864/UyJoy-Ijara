import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min, IsPositive } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({
        description: 'ID of the house being reviewed',
        example: 123,
    })
    @IsInt({ message: 'house_id must be an integer' })
    @IsPositive({ message: 'house_id must be a positive number' })
    house_id: number;

    @ApiProperty({
        description: 'Rating of the house (1-5)',
        example: 4,
        minimum: 1,
        maximum: 5,
    })
    @IsInt({ message: 'Rating must be an integer' })
    @Min(1, { message: 'Rating cannot be less than 1' })
    @Max(5, { message: 'Rating cannot be more than 5' })
    rating: number;

    @ApiProperty({
        description: 'Optional comment for the review',
        example: 'Great place, very cozy!',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Comment must be a string' })
    comment?: string;
}