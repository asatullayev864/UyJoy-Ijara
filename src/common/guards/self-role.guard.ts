import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersRole } from "../enums";

@Injectable()
export class SelfRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const userId = Number(request.user.id);
        const paramId = Number(request.params.id);

        if (user.role === UsersRole.superadmin || user.role === UsersRole.admin) {
            return true;
        }

        if (userId !== paramId) {
            throw new ForbiddenException({
                message: "Ruxsat etilmagan foydalanuvchi",
            });
        }

        return true;
    }
}