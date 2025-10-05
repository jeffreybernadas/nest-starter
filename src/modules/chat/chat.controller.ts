import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiStandardErrorResponse,
} from '@/decorators/swagger.decorator';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@ApiTags('chat')
@ApiBearerAuth('JWT')
@Controller({
  path: 'chat',
  version: '1',
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
    return this.chatService.createChat(creatorId, dto);
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
}
