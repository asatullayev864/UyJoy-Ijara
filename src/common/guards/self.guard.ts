import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class SelfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const userId = Number(request.user.id);
        const paramId = Number(request.params.id);

        if (userId !== paramId) {
            throw new ForbiddenException({
                message: "Ruxsat etilmagan foydalanuvchi",
            });
        }

        return true;
    }
}