import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsUUID, IsDateString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @Expose()
  updatedAt: Date;
}
