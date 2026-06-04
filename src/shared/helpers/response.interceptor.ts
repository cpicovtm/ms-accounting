import {
  type CallHandler,
  type ExecutionContext,
  HttpStatus,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OK_200 } from '../constants/messages';

export interface Response<T> {
  data: T;
  message: string;
  statusCode: number;
  isError: boolean;
}

@Injectable()
export class StandardResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data: data ?? null,
        message: OK_200,
        statusCode: HttpStatus.OK,
        isError: false,
      })),
    );
  }
}
