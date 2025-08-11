import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { FastifyRequestType } from '../types/fastify.type';

export interface UserAgentAndIp {
  userAgent: string | undefined;
  ipAddress: string;
}

export const GetUserAgentAndIp = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserAgentAndIp => {
    const request = context.switchToHttp().getRequest<FastifyRequestType>();

    return {
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip,
    };
  },
);
