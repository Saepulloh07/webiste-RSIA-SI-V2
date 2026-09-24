import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Wraps every successful controller return value in the standard envelope
 * documented in Section 1.1:
 *   { success, message, data, meta? }
 *
 * Controllers may return either:
 *   - a raw payload (wrapped with a default message), or
 *   - { message, data, meta } to control the message/meta explicitly.
 *
 * SSE (text/event-stream) responses and already-sent raw responses bypass
 * this wrapper (see `SKIP_RESPONSE_WRAP` usage in the queue module).
 */
@Injectable()
export class ResponseInterceptor<T = any> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipWrap = Reflect.getMetadata('skip_response_wrap', context.getHandler());
    return next.handle().pipe(
      map((result) => {
        if (skipWrap) {
          return result;
        }
        if (result && typeof result === 'object' && 'data' in result && 'message' in result) {
          const { message, data, meta } = result as {
            message: string;
            data: T;
            meta?: Record<string, unknown>;
          };
          return meta !== undefined
            ? { success: true, message, data, meta }
            : { success: true, message, data };
        }
        return { success: true, message: 'Permintaan berhasil diproses.', data: result as T };
      }),
    );
  }
}
