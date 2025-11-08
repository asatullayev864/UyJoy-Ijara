// import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
// import { PrismaService } from "../../prisma/prisma.service";
// import { UsersRole } from "../enums";

// @Injectable()
// export class OwnerOrAdminGuard implements CanActivate {
//     constructor(private readonly prisma: PrismaService) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const user = request.user;
//         const houseId = Number(request.params.house_id || request.params.id || request.body.house_id);

//         const house = await this.prisma.house.findUnique({ where: { id: houseId } });
//         if (!house) throw new ForbiddenException("Uy topilmadi");

//         // Admin yoki superadmin bo‘lsa → ruxsat
//         if (user.role === UsersRole.superadmin || user.role === UsersRole.admin) {
//             return true;
//         }

//         // Oddiy user bo‘lsa → faqat o‘z uyiga ruxsat
//         if (house.owner_id !== user.id) {
//             throw new ForbiddenException("Siz bu uyga amal qila olmaysiz");
//         }

//         return true;
//     }
// }


import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UsersRole } from "../enums";

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        let houseId: number;

        // Agar route: /houses/:house_id/details
        if (request.params.house_id) {
            houseId = Number(request.params.house_id);

            // Agar route: /house-images/:id → id bu image ID
        } else if (request.params.id) {
            const image = await this.prisma.houseImage.findUnique({
                where: { id: Number(request.params.id) }
            });
            if (!image) throw new ForbiddenException("Uy rasmi topilmadi");
            houseId = image.house_id;

            // Agar body ichida house_id bo‘lsa (POST vaqtida)
        } else if (request.body.house_id) {
            houseId = Number(request.body.house_id);
        }

        // Tekshiruv
        if (!houseId || isNaN(houseId)) {
            throw new ForbiddenException("Uy ID noto'g'ri");
        }

        const house = await this.prisma.house.findUnique({ where: { id: houseId } });
        if (!house) throw new ForbiddenException("Uy topilmadi");

        // Admin yoki superadmin → ruxsat
        if (user.role === UsersRole.superadmin || user.role === UsersRole.admin) {
            return true;
        }

        // Oddiy user → faqat o‘z uyiga ruxsat
        if (house.owner_id !== user.id) {
            throw new ForbiddenException("Siz bu uyga amal qila olmaysiz");
        }

        return true;
    }
}