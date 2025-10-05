import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';
import { ExceptionsFilter } from '@/filters/exceptions.filter';
import { WEBSOCKET_EVENTS } from '@/constants/websocket.constant';
import { LoggerService } from '@/shared/logger/logger.service';

/**
 * Chat-specific WebSocket gateway
 * Handles real-time chat events like typing indicators, read receipts, and online status
 */
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
@UseFilters(ExceptionsFilter)
export class ChatGateway {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Handle user typing event
   * Broadcasts to all other users in the chat room
   */
  @SubscribeMessage(WEBSOCKET_EVENTS.USER_TYPING)
  handleUserTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; userId: string },
  ): void {
    const { chatId, userId } = payload;

    if (!chatId || !userId) {
      this.logger.warn('Invalid typing event payload', 'ChatGateway', payload);
      return;
    }

    // Broadcast to all users in the chat room except the sender
    client.to(`chat:${chatId}`).emit(WEBSOCKET_EVENTS.USER_TYPING, {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: { chatId, userId },
    });

    this.logger.log(`User typing in chat: ${chatId}`, 'ChatGateway', {
      chatId,
      userId,
    });
  }

  /**
   * Handle user stopped typing event
   * Broadcasts to all other users in the chat room
   */
  @SubscribeMessage(WEBSOCKET_EVENTS.USER_STOPPED_TYPING)
  handleUserStoppedTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; userId: string },
  ): void {
    const { chatId, userId } = payload;

    if (!chatId || !userId) {
      this.logger.warn(
        'Invalid stopped typing event payload',
        'ChatGateway',
        payload,
      );
      return;
    }

    // Broadcast to all users in the chat room except the sender
    client.to(`chat:${chatId}`).emit(WEBSOCKET_EVENTS.USER_STOPPED_TYPING, {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: { chatId, userId },
    });

    this.logger.log(`User stopped typing in chat: ${chatId}`, 'ChatGateway', {
      chatId,
      userId,
    });
  }

  /**
   * Handle message read event
   * Broadcasts to all other users in the chat room
   */
  @SubscribeMessage(WEBSOCKET_EVENTS.MESSAGE_READ)
  handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chatId: string; messageId: string; userId: string },
  ): void {
    const { chatId, messageId, userId } = payload;

    if (!chatId || !messageId || !userId) {
      this.logger.warn(
        'Invalid message read event payload',
        'ChatGateway',
        payload,
      );
      return;
    }

    // Broadcast to all users in the chat room except the sender
    client.to(`chat:${chatId}`).emit(WEBSOCKET_EVENTS.MESSAGE_READ, {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: { chatId, messageId, userId },
    });

    this.logger.log(`Message read in chat: ${chatId}`, 'ChatGateway', {
      chatId,
      messageId,
      userId,
    });
  }

  /**
   * Handle bulk messages read event
   * Broadcasts to all other users in the chat room
   */
  @SubscribeMessage(WEBSOCKET_EVENTS.MESSAGES_READ)
  handleMessagesRead(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chatId: string; messageIds: string[]; userId: string },
  ): void {
    const { chatId, messageIds, userId } = payload;

    if (!chatId || !messageIds || !Array.isArray(messageIds) || !userId) {
      this.logger.warn(
        'Invalid messages read event payload',
        'ChatGateway',
        payload,
      );
      return;
    }

    // Broadcast to all users in the chat room except the sender
    client.to(`chat:${chatId}`).emit(WEBSOCKET_EVENTS.MESSAGES_READ, {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: { chatId, messageIds, userId, count: messageIds.length },
    });

    this.logger.log(`Bulk messages read in chat: ${chatId}`, 'ChatGateway', {
      chatId,
      userId,
      count: messageIds.length,
    });
  }

  /**
   * Handle user online in chat event
   * Broadcasts to all other users in the chat room
   */
  @SubscribeMessage(WEBSOCKET_EVENTS.USER_ONLINE_IN_CHAT)
  handleUserOnlineInChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; userId: string },
  ): void {
    const { chatId, userId } = payload;

    if (!chatId || !userId) {
      this.logger.warn(
        'Invalid user online event payload',
        'ChatGateway',
        payload,
      );
      return;
    }

    // Broadcast to all users in the chat room except the sender
    client.to(`chat:${chatId}`).emit(WEBSOCKET_EVENTS.USER_ONLINE_IN_CHAT, {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: { chatId, userId },
    });

    this.logger.log(`User online in chat: ${chatId}`, 'ChatGateway', {
      chatId,
      userId,
    });
  }

  /**
   * Handle user offline in chat event
   * Broadcasts to all other users in the chat room
   */
  @SubscribeMessage(WEBSOCKET_EVENTS.USER_OFFLINE_IN_CHAT)
  handleUserOfflineInChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; userId: string },
  ): void {
    const { chatId, userId } = payload;

    if (!chatId || !userId) {
      this.logger.warn(
        'Invalid user offline event payload',
        'ChatGateway',
        payload,
      );
      return;
    }

    // Broadcast to all users in the chat room except the sender
    client.to(`chat:${chatId}`).emit(WEBSOCKET_EVENTS.USER_OFFLINE_IN_CHAT, {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: { chatId, userId },
    });

    this.logger.log(`User offline in chat: ${chatId}`, 'ChatGateway', {
      chatId,
      userId,
    });
  }
}
