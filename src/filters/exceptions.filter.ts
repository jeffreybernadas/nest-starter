import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { CustomErrorException } from '@/filters/exceptions/custom-error.exception';
import { Prisma } from '@prisma/client';

@Catch()
export class ExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest<ExpressRequest>();
    const response = host.switchToHttp().getResponse<ExpressResponse>();

    let statusCode: number;
    let message: string;
    let customCode: string;

    // Handle Prisma Known Request Errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          statusCode = 409;
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          message = `Unique constraint failed on field(s): ${exception.meta?.target}`;
          customCode = 'UNIQUE_CONSTRAINT_VIOLATION';
          break;
        case 'P2025': // Record not found
          statusCode = 404;
          message = `Record not found`;
          customCode = 'RECORD_NOT_FOUND';
          break;
        default:
          statusCode = 400;
          message = `Database error: ${exception.message}`;
          customCode = 'PRISMA_ERROR';
      }
    }
    // Handle CustomErrorException specifically
    else if (exception instanceof CustomErrorException) {
      const customException = exception as CustomErrorException;
      statusCode = customException.getStatus();
      message = customException.message;
      customCode = customException.getCustomCode();
    } else if (exception instanceof HttpException) {
      // Handle other HttpExceptions
      const httpException = exception as HttpException;
      statusCode = httpException.getStatus();
      const exceptionResponse = httpException.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        customCode = 'GENERIC_ERROR';
      } else if (exceptionResponse && typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || 'An error occurred';
        customCode = (responseObj.customCode as string) || 'GENERIC_ERROR';
      } else {
        message = 'An error occurred';
        customCode = 'GENERIC_ERROR';
      }
    } else {
      // Handle non-HTTP exceptions
      statusCode = 500;
      message = 'Internal server error';
      customCode = 'GENERIC_ERROR';
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
      error: {
        code: customCode,
        message,
      },
    });
  }
}
