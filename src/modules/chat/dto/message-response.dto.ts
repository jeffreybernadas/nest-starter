import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for message response
 */
export class MessageResponseDto {
  @ApiProperty({
    description: 'Message ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Chat ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  chatId: string;

  @ApiProperty({
    description: 'Sender Keycloak user ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  senderId: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, team!',
  })
  content: string;

  @ApiProperty({
    description: 'Whether message has been edited',
    example: false,
  })
  isEdited: boolean;

  @ApiProperty({
    description: 'Whether message has been deleted',
    example: false,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: 'Timestamp when message was created',
    example: '2025-10-05T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when message was last updated',
    example: '2025-10-05T12:00:00.000Z',
  })
  updatedAt: Date;
}
