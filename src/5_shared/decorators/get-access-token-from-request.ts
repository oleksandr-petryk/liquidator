import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAccessTokenFromRequest = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.headers['authorization'].split(' ').slice(1).join(' ');
  },
);
