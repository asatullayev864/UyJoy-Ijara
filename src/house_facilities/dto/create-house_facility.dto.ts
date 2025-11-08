import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateHouseFacilityDto {
    @ApiProperty({
        example: 3,
        description: "Uy ID raqami (house jadvalidan foreign key)",
    })
    @IsInt({ message: "house_id butun son bo'lishi kerak" })
    house_id: number;

    @ApiProperty({
        example: "Air Conditioner, Wi-Fi, Parking",
        description: "Uyda mavjud qulayliklar ro'yxati (string shaklida)",
    })
    @IsString({ message: "conditions matn ko'rinishida bo'lishi kerak" })
    conditions: string;
}