import { JwtTokenPayload } from '../interfaces/jwt-token.interface';
import { FastifyRequest } from 'fastify';

export interface FastifyRequestType<P = Record<string, string>>
  extends FastifyRequest<{ Params: P }> {
  user: JwtTokenPayload;
}
