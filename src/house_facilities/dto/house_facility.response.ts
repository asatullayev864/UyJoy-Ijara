import { ApiProperty } from "@nestjs/swagger";

export class HouseFacilityResponse {
    @ApiProperty({ example: 2 })
    id: number;

    @ApiProperty({ example: 1 })
    house_id: number;

    @ApiProperty({ example: "Air Conditioner, Wi-Fi, Heater" })
    conditions: string;
}