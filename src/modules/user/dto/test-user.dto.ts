import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class TestUserDto {
  @ApiProperty({
    description: 'User name for testing',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;
}
