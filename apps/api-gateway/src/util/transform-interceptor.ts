import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, { data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: T }> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
