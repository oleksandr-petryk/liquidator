import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { getAuthData } from '../guards/auth.guard';

export const GetAccessTokenFromRequest = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    ctx.switchToHttp().getRequest();

    return getAuthData(ctx, new Reflector());
  },
);
