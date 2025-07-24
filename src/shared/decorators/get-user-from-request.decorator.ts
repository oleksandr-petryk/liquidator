import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtTokenPayload } from '../interfaces/jwt-token.interface';

export const GetUserFromRequest = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtTokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtTokenPayload;
  },
);
