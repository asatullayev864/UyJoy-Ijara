import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
    @ApiProperty({
        description: "Report qilinayotgan uyning ID'si",
        example: 12,
    })
    @IsInt()
    house_id: number;

    @ApiProperty({
        description: "Report sababi",
        example: "Uy suratlari real emas yoki aldov.",
    })
    @IsString()
    @IsNotEmpty()
    reason: string;
}