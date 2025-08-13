import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { getAuthData } from '../guards/auth.guard';

export const GetAccessTokenFromRequest = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    ctx.switchToHttp().getRequest();

    const accessToken = getAuthData(ctx, new Reflector()).accessToken;

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    return accessToken;
  },
);
