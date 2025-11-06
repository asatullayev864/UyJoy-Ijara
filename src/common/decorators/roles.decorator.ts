import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);


import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from "../../app.constants";

export const CookieGetter = createParamDecorator(
    (cookieName: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.cookies?.[cookieName];
    },
);