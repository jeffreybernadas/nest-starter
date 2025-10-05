import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/database/database.service';
import { LoggerService } from '@/shared/logger/logger.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ChatType } from '@prisma/client';
import {
  CursorPageOptionsDto,
  CursorPaginatedDto,
} from '@/common/dto/cursor-pagination';
import { cursorPaginateWithPrisma } from '@/utils/pagination/prisma-pagination.util';
import { Order } from '@/constants/app.constant';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Create a new chat (GROUP or DIRECT)
   * @param creatorId - Keycloak user ID of the creator
   * @param dto - Chat creation data
   * @returns Created chat with members
   */
  async createChat(
    creatorId: string,
    dto: CreateChatDto,
  ): Promise<ChatResponseDto> {
    // Validate GROUP chat has a name
    if (dto.type === ChatType.GROUP && !dto.name) {
      throw new BadRequestException('Group chats must have a name');
    }

    // Validate DIRECT chat has exactly 1 other member
    if (dto.type === ChatType.DIRECT && dto.memberIds.length !== 1) {
      throw new BadRequestException(
        'Direct chats must have exactly 1 other member',
      );
    }

    // Remove duplicates and ensure creator is not in memberIds
    const uniqueMemberIds = Array.from(
      new Set(dto.memberIds.filter((id) => id !== creatorId)),
    );

    // Validate we still have the right number of members after deduplication
    if (dto.type === ChatType.DIRECT && uniqueMemberIds.length !== 1) {
      throw new BadRequestException(
        'Direct chats must have exactly 1 other member (excluding creator)',
      );
    }

    if (uniqueMemberIds.length === 0) {
      throw new BadRequestException('Chat must have at least one other member');
    }

    // Create chat and members in a transaction
    const chat = await this.prisma.$transaction(async (tx) => {
      // Create the chat
      const newChat = await tx.chat.create({
        data: {
          name: dto.name,
          type: dto.type,
          creatorId,
        },
      });

      // Prepare member data: creator + other members
      const memberData = [
        { chatId: newChat.id, userId: creatorId },
        ...uniqueMemberIds.map((userId) => ({
          chatId: newChat.id,
          userId,
        })),
      ];

      // Create all members
      await tx.chatMember.createMany({
        data: memberData,
      });

      // Fetch the created chat with members
      const chatWithMembers = await tx.chat.findUnique({
        where: { id: newChat.id },
        include: {
          members: {
            orderBy: { joinedAt: 'asc' },
          },
        },
      });

      return chatWithMembers;
    });

    this.logger.log(`Chat created: ${chat!.id}`, 'ChatService', {
      chatId: chat!.id,
      type: chat!.type,
      creatorId,
      memberCount: chat!.members.length,
    });

    return {
      id: chat!.id,
      name: chat!.name,
      type: chat!.type,
      creatorId: chat!.creatorId,
      createdAt: chat!.createdAt,
      updatedAt: chat!.updatedAt,
      members: chat!.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        joinedAt: member.joinedAt,
      })),
    };
  }

  /**
   * Get all chats the user belongs to
   * @param userId - Keycloak user ID
   * @returns List of chats the user is a member of
   */
  async getUserChats(userId: string): Promise<ChatResponseDto[]> {
    // Find all chats where the user is a member
    const chatMembers = await this.prisma.chatMember.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            members: {
              orderBy: { joinedAt: 'asc' },
            },
          },
        },
      },
      orderBy: {
        chat: {
          updatedAt: 'desc',
        },
      },
    });

    this.logger.log(
      `Retrieved ${chatMembers.length} chats for user`,
      'ChatService',
      {
        userId,
        chatCount: chatMembers.length,
      },
    );

    return chatMembers.map((chatMember) => ({
      id: chatMember.chat.id,
      name: chatMember.chat.name,
      type: chatMember.chat.type,
      creatorId: chatMember.chat.creatorId,
      createdAt: chatMember.chat.createdAt,
      updatedAt: chatMember.chat.updatedAt,
      members: chatMember.chat.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        joinedAt: member.joinedAt,
      })),
    }));
  }

  /**
   * Get detailed information about a specific chat
   * @param chatId - Chat ID
   * @param userId - Keycloak user ID of the requesting user
   * @returns Chat details with all members
   */
  async getChatById(chatId: string, userId: string): Promise<ChatResponseDto> {
    // Check if chat exists
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: {
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Check if user is a member of the chat
    const isMember = chat.members.some((member) => member.userId === userId);

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    this.logger.log(`Retrieved chat details: ${chatId}`, 'ChatService', {
      chatId,
      userId,
      type: chat.type,
      memberCount: chat.members.length,
    });

    return {
      id: chat.id,
      name: chat.name,
      type: chat.type,
      creatorId: chat.creatorId,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      members: chat.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        joinedAt: member.joinedAt,
      })),
    };
  }

  /**
   * Send a message to a chat
   * @param chatId - Chat ID
   * @param senderId - Keycloak user ID of the sender
   * @param dto - Message content
   * @returns Created message
   */
  async sendMessage(
    chatId: string,
    senderId: string,
    dto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    // Verify chat exists and get members
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: true,
      },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Verify sender is a member of the chat
    const isMember = chat.members.some((member) => member.userId === senderId);

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    // Create the message and update chat's updatedAt in a transaction
    const message = await this.prisma.$transaction(async (tx) => {
      // Create message
      const newMessage = await tx.message.create({
        data: {
          chatId,
          senderId,
          content: dto.content,
        },
      });

      // Update chat's updatedAt timestamp (for sorting in chat list)
      await tx.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });

      return newMessage;
    });

    this.logger.log(`Message sent to chat: ${chatId}`, 'ChatService', {
      messageId: message.id,
      chatId,
      senderId,
    });

    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
      isEdited: message.isEdited,
      isDeleted: message.isDeleted,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  /**
   * Add a member to a group chat
   * @param chatId - Chat ID
   * @param requesterId - Keycloak user ID of the user making the request
   * @param dto - User ID to add
   * @returns Updated chat with all members
   */
  async addMemberToChat(
    chatId: string,
    requesterId: string,
    dto: AddMemberDto,
  ): Promise<ChatResponseDto> {
    // Verify chat exists and get details
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: true,
      },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Verify chat is a GROUP chat (not DIRECT)
    if (chat.type !== ChatType.GROUP) {
      throw new BadRequestException('Can only add members to group chats');
    }

    // Verify requester is a member of the chat
    const isRequesterMember = chat.members.some(
      (member) => member.userId === requesterId,
    );

    if (!isRequesterMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    // Verify user to add is not already a member
    const isAlreadyMember = chat.members.some(
      (member) => member.userId === dto.userId,
    );

    if (isAlreadyMember) {
      throw new BadRequestException('User is already a member of this chat');
    }

    // Add the new member
    await this.prisma.chatMember.create({
      data: {
        chatId,
        userId: dto.userId,
      },
    });

    // Fetch updated chat with all members
    const updatedChat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: {
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    this.logger.log(`Member added to chat: ${chatId}`, 'ChatService', {
      chatId,
      newMemberId: dto.userId,
      requesterId,
    });

    return {
      id: updatedChat!.id,
      name: updatedChat!.name,
      type: updatedChat!.type,
      creatorId: updatedChat!.creatorId,
      createdAt: updatedChat!.createdAt,
      updatedAt: updatedChat!.updatedAt,
      members: updatedChat!.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        joinedAt: member.joinedAt,
      })),
    };
  }

  /**
   * Get chat messages with cursor-based pagination
   * @param chatId - Chat ID
   * @param userId - Keycloak user ID of the requesting user
   * @param cursorPageOptionsDto - Cursor pagination options
   * @returns Paginated list of messages
   */
  async getChatMessages(
    chatId: string,
    userId: string,
    cursorPageOptionsDto: CursorPageOptionsDto,
  ): Promise<CursorPaginatedDto<MessageResponseDto>> {
    // Verify chat exists and get members
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: true,
      },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Verify user is a member of the chat
    const isMember = chat.members.some((member) => member.userId === userId);

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    // Build orderBy - messages should be ordered by createdAt
    // Default to DESC (newest first) for chat messages
    const orderBy = {
      createdAt: cursorPageOptionsDto.order === Order.Asc ? 'asc' : 'desc',
    } as const;

    // Build where clause
    const where: {
      chatId: string;
      isDeleted: boolean;
      content?: { contains: string; mode: 'insensitive' };
    } = {
      chatId,
      isDeleted: false, // Only return non-deleted messages
    };

    // Add search filter if provided
    if (cursorPageOptionsDto.search) {
      where.content = {
        contains: cursorPageOptionsDto.search,
        mode: 'insensitive' as const,
      };
    }

    // Use cursor pagination utility
    const paginatedMessages = await cursorPaginateWithPrisma<
      MessageResponseDto,
      NonNullable<Parameters<typeof this.prisma.message.findMany>[0]>
    >(
      this.prisma.message,
      cursorPageOptionsDto,
      {
        where,
        orderBy,
      },
      'id', // Use 'id' as cursor field
    );

    this.logger.log(
      `Retrieved ${paginatedMessages.data.length} messages for chat: ${chatId}`,
      'ChatService',
      {
        chatId,
        userId,
        messageCount: paginatedMessages.data.length,
        hasNextPage: paginatedMessages.meta.hasNextPage,
        search: cursorPageOptionsDto.search,
      },
    );

    return paginatedMessages;
  }
}
