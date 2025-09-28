/**
 * Custom error codes enum for application-specific errors
 * These codes provide more granular error identification beyond HTTP status codes
 */
export enum CustomErrorCode {
  // Generic errors
  GENERIC_ERROR = 'GENERIC_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // OTP related errors
  OTP_REQUIRED = 'OTP_REQUIRED',
  INVALID_OTP = 'INVALID_OTP',
  OTP_EXPIRED = 'OTP_EXPIRED',

  // External service errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  THIRD_PARTY_API_ERROR = 'THIRD_PARTY_API_ERROR',
}
