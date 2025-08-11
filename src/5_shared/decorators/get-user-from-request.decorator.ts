import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtTokenPayload } from '../types/interfaces/jwt-token.interface';

export const GetUserFromRequest = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtTokenPayload => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException();
    }

    return request.user as JwtTokenPayload;
  },
);
