import { ApiProperty } from "@nestjs/swagger";

export class HouseDetailResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1, description: "Uy IDsi" })
    house_id: number;

    @ApiProperty({ example: 3, description: "Xonalar soni" })
    rooms_count: number;

    @ApiProperty({ example: 2, description: "Hammomlar soni" })
    bathrooms_count: number;

    @ApiProperty({ example: 120, description: "Kvadrat metr" })
    area: number;

    @ApiProperty({ example: 2, description: "Qavat", required: false })
    floor?: number;

    @ApiProperty({ example: true, description: "Avtoturargoh borligi" })
    has_parking: boolean;
}