import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtInternalService } from '../../2_service/auth/jwt-internal.service';
import { RedisService } from '../../4_low/redis/redis.service';
import {
  AUTHORIZATION_HEADER_NAME,
  USER_ROLE_REQUIRED_METADATA_KEY,
} from '../config/const/auth.const';
import { AuthUserType } from '../enums/auth.enum';
import { FastifyRequestType } from '../types/fastify.type';

export interface AuthData {
  accessToken: string | undefined;
  requiredRoles: AuthUserType[];
}

export const getAuthData = (
  context: ExecutionContext,
  reflector: Reflector,
): AuthData => {
  const request = context.switchToHttp().getRequest<FastifyRequestType>();

  const accessToken =
    request.headers[AUTHORIZATION_HEADER_NAME]?.split(' ')?.pop();

  const requiredRoles: AuthUserType[] =
    reflector.get<AuthUserType[]>(
      USER_ROLE_REQUIRED_METADATA_KEY,
      context.getHandler(),
    ) ?? [];

  return {
    accessToken,
    requiredRoles,
  };
};

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly jwtInternalService: JwtInternalService,
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | never> {
    const request = context.switchToHttp().getRequest<FastifyRequestType>();

    const { accessToken } = getAuthData(context, this.reflector);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    if (await this.redisService.getValue({ key: accessToken })) {
      throw new UnauthorizedException();
    }

    try {
      request.user = this.jwtInternalService.verifyAccessToken(accessToken);
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }
}
