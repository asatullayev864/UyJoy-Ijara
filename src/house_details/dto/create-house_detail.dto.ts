import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class CreateHouseDetailDto {
    @IsInt()
    @Min(1)
    rooms_count: number;

    @IsInt()
    @Min(1)
    bathrooms_count: number;

    @IsInt()
    @Min(10)
    area: number;

    @IsOptional()
    @IsInt()
    floor?: number;

    @IsOptional()
    @IsBoolean()
    has_parking?: boolean;
}