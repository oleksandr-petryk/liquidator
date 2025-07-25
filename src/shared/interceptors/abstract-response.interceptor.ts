import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { map } from 'rxjs/operators';

@Injectable()
export class AbstractResponseInterceptor {
  // export class AbstractResponseInterceptor<T> implements NestInterceptor<T, AbstractResponseDto<T>> {
  // Observable<AbstractResponseDto<T>>
  intercept(_context: ExecutionContext, next: CallHandler): any {
    const request = _context.switchToHttp().getRequest<FastifyRequest>();
    const requestId = request.headers['request-id'] || request.id;

    return next.handle().pipe(
      map((data) => ({
        payload: data,
        requestId,
      })),
    );
  }
}
