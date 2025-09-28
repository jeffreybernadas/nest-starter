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

@Catch()
export class ExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest<ExpressRequest>();
    const response = host.switchToHttp().getResponse<ExpressResponse>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException ? exception.getStatus() : 500;

    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : 'error';

    let message: string;
    let customCode: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      customCode = 'GENERIC_ERROR';
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as Record<string, unknown>;
      message = (responseObj.message as string) || 'An error occurred';
      customCode = (responseObj.customCode as string) || 'GENERIC_ERROR';
    } else {
      message = isHttpException ? 'An error occurred' : 'Internal server error';
      customCode = 'GENERIC_ERROR';
    }

    response.status(statusCode).json({
      message,
      statusCode,
      code: customCode,
      timeStamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
