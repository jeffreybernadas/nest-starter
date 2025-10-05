import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/database/database.service';
import { LoggerService } from '@/shared/logger/logger.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { ChatType } from '@prisma/client';

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
}
