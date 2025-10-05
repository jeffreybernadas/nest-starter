import { Controller, Post, Body } from '@nestjs/common';
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
}
