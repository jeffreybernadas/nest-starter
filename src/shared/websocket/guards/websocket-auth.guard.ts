import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { LoggerService } from '@/shared/logger/logger.service';

/**
 * WebSocket authentication guard placeholder
 * TODO: Implement Keycloak token validation when authentication is added
 *
 * This guard will be used to protect WebSocket event handlers that require authentication.
 * Usage:
 * @UseGuards(WebSocketAuthGuard)
 * @SubscribeMessage('protected-event')
 * handleProtectedEvent() { ... }
 */
@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    // TODO: Implement actual authentication logic
    // 1. Extract token from client.handshake.auth or client.handshake.headers
    // 2. Validate token with Keycloak
    // 3. Attach user info to client.data
    // 4. Return true if authenticated, false otherwise

    // For now, log and allow all connections
    this.logger.warn(
      'WebSocketAuthGuard: Authentication not yet implemented',
      'WebSocketAuthGuard',
      { socketId: client.id },
    );

    // Placeholder: Allow all connections until Keycloak is integrated
    return true;
  }
}
