import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../../app.constants";

@Injectable()
export class JwtRoleGuard implements CanActivate{

    constructor(
        private readonly reflector: Reflector
    ) { }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredRoles) {
            return true;
        }

        const permission = requiredRoles.includes(request.user.role);

        if (!permission) {
            throw new ForbiddenException({
                message: "Sizda bunday huquq yo'q!"
            });
        }
        return true;
    }
}