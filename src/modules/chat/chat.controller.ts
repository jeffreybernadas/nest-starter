import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiStandardErrorResponse,
  ApiCursorPaginatedResponse,
} from '@/decorators/swagger.decorator';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { WebSocketService } from '@/shared/websocket/websocket.service';
import { WEBSOCKET_EVENTS } from '@/constants/websocket.constant';
import {
  CursorPageOptionsDto,
  CursorPaginatedDto,
} from '@/common/dto/cursor-pagination';

@ApiTags('chat')
@ApiBearerAuth('JWT')
@Controller({
  path: 'chat',
  version: '1',
})
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly websocketService: WebSocketService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new chat',
    description:
      'Creates a new chat (GROUP or DIRECT). The authenticated user is automatically added as the creator and a member. For DIRECT chats, exactly 1 other user must be specified. For GROUP chats, a name is required.',
  })
  @ApiStandardResponse({
    status: 201,
    description: 'Chat created successfully',
    type: ChatResponseDto,
  })
  @ApiStandardErrorResponse({
    status: 400,
    description: 'Validation Error',
    errorCode: 'VALIDATION_ERROR',
  })
  @ApiStandardErrorResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    errorCode: 'UNAUTHORIZED',
  })
  async createChat(
    @AuthenticatedUser() user: any,
    @Body() dto: CreateChatDto,
  ): Promise<ChatResponseDto> {
    const creatorId = user.sub as string;
    const chat = await this.chatService.createChat(creatorId, dto);

    // Emit WebSocket event to notify all members about the new chat
    // Each member should be listening to their personal notification room
    if (chat.members) {
      chat.members.forEach((member) => {
        this.websocketService.emitToRoom(
          `user:${member.userId}`,
          WEBSOCKET_EVENTS.USER_JOINED_CHAT,
          {
            chatId: chat.id,
            chatName: chat.name,
            chatType: chat.type,
            creatorId: chat.creatorId,
          },
          { userId: member.userId },
        );
      });
    }

    return chat;
  }

  @Get()
  @ApiOperation({
    summary: 'List all chats user belongs to',
    description:
      'Retrieves all chats where the authenticated user is a member. Returns chats ordered by most recently updated first.',
  })
  @ApiStandardResponse({
    status: 200,
    description: 'Chats retrieved successfully',
    type: ChatResponseDto,
    isArray: true,
  })
  @ApiStandardErrorResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    errorCode: 'UNAUTHORIZED',
  })
  getUserChats(@AuthenticatedUser() user: any): Promise<ChatResponseDto[]> {
    const userId = user.sub as string;
    return this.chatService.getUserChats(userId);
  }

  @Get(':chatId')
  @ApiOperation({
    summary: 'Get chat details',
    description:
      'Retrieves detailed information about a specific chat including all members. User must be a member of the chat to access this information.',
  })
  @ApiStandardResponse({
    status: 200,
    description: 'Chat details retrieved successfully',
    type: ChatResponseDto,
  })
  @ApiStandardErrorResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    errorCode: 'UNAUTHORIZED',
  })
  @ApiStandardErrorResponse({
    status: 403,
    description: 'Forbidden - User is not a member of this chat',
    errorCode: 'FORBIDDEN',
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Not Found - Chat does not exist',
    errorCode: 'NOT_FOUND',
  })
  getChatById(
    @AuthenticatedUser() user: any,
    @Param('chatId') chatId: string,
  ): Promise<ChatResponseDto> {
    const userId = user.sub as string;
    return this.chatService.getChatById(chatId, userId);
  }

  @Get(':chatId/messages')
  @ApiOperation({
    summary: 'Fetch chat message history',
    description:
      'Retrieves paginated message history for a chat using cursor-based pagination. User must be a member of the chat. Only non-deleted messages are returned. Supports optional search filtering by message content.',
  })
  @ApiCursorPaginatedResponse(MessageResponseDto)
  @ApiStandardErrorResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    errorCode: 'UNAUTHORIZED',
  })
  @ApiStandardErrorResponse({
    status: 403,
    description: 'Forbidden - User is not a member of this chat',
    errorCode: 'FORBIDDEN',
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Not Found - Chat does not exist',
    errorCode: 'NOT_FOUND',
  })
  async getChatMessages(
    @AuthenticatedUser() user: any,
    @Param('chatId') chatId: string,
    @Query() cursorPageOptionsDto: CursorPageOptionsDto,
  ): Promise<CursorPaginatedDto<MessageResponseDto>> {
    const userId = user.sub as string;
    return await this.chatService.getChatMessages(
      chatId,
      userId,
      cursorPageOptionsDto,
    );
  }

  @Post(':chatId/messages')
  @ApiOperation({
    summary: 'Send a message to a chat',
    description:
      'Sends a new message to the specified chat. User must be a member of the chat. The message is saved to the database and broadcast to other chat members via WebSocket in real-time.',
  })
  @ApiStandardResponse({
    status: 201,
    description: 'Message sent successfully',
    type: MessageResponseDto,
  })
  @ApiStandardErrorResponse({
    status: 400,
    description: 'Validation Error',
    errorCode: 'VALIDATION_ERROR',
  })
  @ApiStandardErrorResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    errorCode: 'UNAUTHORIZED',
  })
  @ApiStandardErrorResponse({
    status: 403,
    description: 'Forbidden - User is not a member of this chat',
    errorCode: 'FORBIDDEN',
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Not Found - Chat does not exist',
    errorCode: 'NOT_FOUND',
  })
  async sendMessage(
    @AuthenticatedUser() user: any,
    @Param('chatId') chatId: string,
    @Body() dto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    const senderId = user.sub as string;

    // Send message via service (saves to DB)
    const message = await this.chatService.sendMessage(chatId, senderId, dto);

    // Emit WebSocket event to chat room (real-time notification)
    // Room name format: chat:${chatId}
    this.websocketService.emitToRoom(
      `chat:${chatId}`,
      WEBSOCKET_EVENTS.NEW_MESSAGE,
      message,
      {
        senderId,
        chatId,
      },
    );

    return message;
  }

  @Post(':chatId/members')
  @ApiOperation({
    summary: 'Add a member to a group chat',
    description:
      'Adds a new member to an existing group chat. Only works for GROUP chats (not DIRECT). The requesting user must be a member of the chat. The user being added must not already be a member.',
  })
  @ApiStandardResponse({
    status: 201,
    description: 'Member added successfully',
    type: ChatResponseDto,
  })
  @ApiStandardErrorResponse({
    status: 400,
    description:
      'Validation Error - Chat is not a group or user already a member',
    errorCode: 'VALIDATION_ERROR',
  })
  @ApiStandardErrorResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    errorCode: 'UNAUTHORIZED',
  })
  @ApiStandardErrorResponse({
    status: 403,
    description: 'Forbidden - User is not a member of this chat',
    errorCode: 'FORBIDDEN',
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Not Found - Chat does not exist',
    errorCode: 'NOT_FOUND',
  })
  async addMemberToChat(
    @AuthenticatedUser() user: any,
    @Param('chatId') chatId: string,
    @Body() dto: AddMemberDto,
  ): Promise<ChatResponseDto> {
    const requesterId = user.sub as string;

    // Add member via service
    const updatedChat = await this.chatService.addMemberToChat(
      chatId,
      requesterId,
      dto,
    );

    // Emit WebSocket event to chat room (notify existing members)
    this.websocketService.emitToRoom(
      `chat:${chatId}`,
      WEBSOCKET_EVENTS.MEMBER_ADDED,
      {
        chatId,
        userId: dto.userId,
        addedBy: requesterId,
      },
      {
        chatId,
        memberCount: updatedChat.members?.length || 0,
      },
    );

    // Emit WebSocket event to the new member's personal room
    this.websocketService.emitToRoom(
      `user:${dto.userId}`,
      WEBSOCKET_EVENTS.USER_JOINED_CHAT,
      {
        chatId: updatedChat.id,
        chatName: updatedChat.name,
        chatType: updatedChat.type,
        addedBy: requesterId,
      },
      { userId: dto.userId },
    );

    return updatedChat;
  }
}
