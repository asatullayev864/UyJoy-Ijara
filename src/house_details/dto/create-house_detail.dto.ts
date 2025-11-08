import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateHouseDetailDto {
    @ApiProperty({ example: 3, description: "Xonalar soni" })
    @IsInt()
    @Min(1)
    rooms_count: number;

    @ApiProperty({ example: 2, description: "Hammomlar soni" })
    @IsInt()
    @Min(1)
    bathrooms_count: number;

    @ApiProperty({ example: 120, description: "Uy maydoni (kv.m)" })
    @IsInt()
    @Min(10)
    area: number;

    @ApiPropertyOptional({ example: 2, description: "Qavat (majburiy emas)" })
    @IsOptional()
    @IsInt()
    floor?: number;

    @ApiPropertyOptional({ example: true, description: "Avtoturargoh borligi (majburiy emas)" })
    @IsOptional()
    @IsBoolean()
    has_parking?: boolean;
}