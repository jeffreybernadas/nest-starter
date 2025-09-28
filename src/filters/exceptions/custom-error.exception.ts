import { CustomErrorCode } from '@/enums/custom-error-enum';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom error class to throw custom errors with custom error codes
 * @param message - Error message
 * @param statusCode - HTTP status code
 * @param customCode - Custom error code
 */
export class CustomErrorException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    customCode?: CustomErrorCode,
  ) {
    super({ message, customCode }, statusCode);
  }
}
