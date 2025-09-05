import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../dtos/response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // Nest built-in exceptions often return an object or string
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        const errObj = res as Record<string, any>;
        message = errObj.message || exception.message;
        errors = errObj;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ResponseDto = {
      status: 'error',
      message,
      errors,
    };

    // ✅ keep original HTTP status code
    response.status(status).json(errorResponse);
  }
}
