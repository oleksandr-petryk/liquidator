import type { FastifyRequest } from 'fastify';

import { JwtTokenPayload } from './interfaces/jwt-token.interface';

export interface FastifyRequestType<P = Record<string, string>>
  extends FastifyRequest<{ Params: P }> {
  user: JwtTokenPayload;
}
