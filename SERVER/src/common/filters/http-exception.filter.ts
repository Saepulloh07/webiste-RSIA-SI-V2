import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ThrottlerException } from '@nestjs/throttler';

/**
 * Normalizes every thrown error into the standard failure envelope
 * (Section 1.2):
 *   { success: false, message, errors?, code? }
 *
 * Special-cased per documentation:
 *  - 429 Too Many Requests uses the shape given in the
 *    "KEAMANAN, RATE LIMITING & PENANGANAN ERROR" section:
 *    { success: false, error, retryAfter }
 *  - class-validator failures are mapped into `errors: { field: [msgs] }`.
 *
 * Never leaks stack traces, SQL errors, or raw driver messages to the client;
 * those are logged server-side only.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request as any).requestId;

    if (exception instanceof ThrottlerException) {
      response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        error: 'Terlalu banyak request, coba lagi dalam beberapa saat',
        retryAfter: 600,
      });
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Terjadi kesalahan pada server.';
    let errors: Record<string, string[]> | null = null;
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const asObj = body as Record<string, unknown>;
        // class-validator ValidationPipe default shape: { message: string[] | string, error, statusCode }
        if (Array.isArray(asObj.message)) {
          message = 'Validasi gagal. Periksa kembali data yang Anda masukkan.';
          errors = this.groupValidationErrors(asObj.message as string[]);
          status = HttpStatus.UNPROCESSABLE_ENTITY;
        } else if (typeof asObj.message === 'string') {
          message = asObj.message;
        }
        if (typeof asObj.code === 'string') code = asObj.code;
        if (asObj.errors && typeof asObj.errors === 'object') {
          errors = asObj.errors as Record<string, string[]>;
        }
      }
    } else {
      // Unknown/unexpected error - log full detail, never expose it.
      this.logger.error(
        `[${requestId}] Unhandled exception: ${(exception as Error)?.message}`,
        (exception as Error)?.stack,
      );
    }

    if (status >= 500) {
      this.logger.error(`[${requestId}] ${message}`);
    }

    response.status(status).json({
      success: false,
      message,
      errors,
      ...(code ? { code } : {}),
    });
  }

  private groupValidationErrors(messages: string[]): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};
    for (const msg of messages) {
      const [field] = msg.split(' ');
      const key = field || 'general';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(msg);
    }
    return grouped;
  }
}
