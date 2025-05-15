import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class AbstractResponseInterceptor {
  // export class AbstractResponseInterceptor<T> implements NestInterceptor<T, AbstractResponseDto<T>> {
  // Observable<AbstractResponseDto<T>>
  intercept(_context: ExecutionContext, next: CallHandler): any {
    return next.handle().pipe(
      map((data) => ({
        payload: data,
      })),
    );
  }
}
