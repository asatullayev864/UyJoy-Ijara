import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UsersRole } from "../enums";

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const houseId = Number(request.params.house_id || request.params.id);

        const house = await this.prisma.house.findUnique({ where: { id: houseId } });
        if (!house) throw new ForbiddenException("Uy topilmadi");

        // Admin yoki superadmin bo‘lsa → ruxsat
        if (user.role === UsersRole.superadmin || user.role === UsersRole.admin) {
            return true;
        }

        // Oddiy user bo‘lsa → faqat o‘z uyiga ruxsat
        if (house.owner_id !== user.id) {
            throw new ForbiddenException("Siz bu uyga amal qila olmaysiz");
        }

        return true;
    }
}