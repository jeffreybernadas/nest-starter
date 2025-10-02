import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { WebSocketAuthGuard } from '@/shared/websocket/guards/websocket-auth.guard';

/**
 * Decorator to apply authentication guard to WebSocket event handlers
 * Usage: @WsAuthenticated()
 */
export const WsAuthenticated = () => {
  return applyDecorators(UseGuards(WebSocketAuthGuard));
};

/**
 * Decorator to apply custom rate limiting to WebSocket event handlers
 * Usage: @WsThrottle({ ttl: 60000, limit: 10 })
 *
 * @param options - Throttle options with ttl (time to live in ms) and limit (max requests)
 */
export const WsThrottle = (options: { ttl: number; limit: number }) => {
  return applyDecorators(Throttle({ default: options }));
};

/**
 * Decorator to skip rate limiting for specific WebSocket event handlers
 * Usage: @WsSkipThrottle()
 */
export const WsSkipThrottle = () => {
  return applyDecorators(Throttle({ default: { ttl: 0, limit: 0 } }));
};

/**
 * Decorator to combine authentication and rate limiting for WebSocket handlers
 * Usage: @WsProtected({ ttl: 60000, limit: 50 })
 *
 * @param throttleOptions - Optional throttle options, uses default if not provided
 */
export const WsProtected = (throttleOptions?: {
  ttl: number;
  limit: number;
}) => {
  const decorators = [UseGuards(WebSocketAuthGuard)];

  if (throttleOptions) {
    decorators.push(Throttle({ default: throttleOptions }));
  }

  return applyDecorators(...decorators);
};

/**
 * Decorator for WebSocket event handlers that require room membership
 * This is a marker decorator that can be used with custom guards in the future
 * Usage: @WsRequireRoom()
 */
export const WsRequireRoom = () => {
  // Placeholder for future room membership validation
  return applyDecorators();
};
