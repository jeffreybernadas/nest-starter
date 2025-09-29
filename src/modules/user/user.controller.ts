import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiStandardErrorResponse,
} from '@/decorators/swagger.decorator';
import { UserService } from '@/modules/user/user.service';
import { UserDto } from './dto/user.dto';
import {
  ApiCursorPaginatedResponse,
  ApiPaginatedResponse,
} from '@/decorators/swagger.decorator';
import {
  OffsetPageOptionsDto,
  OffsetPaginatedDto,
} from '@/common/dto/offset-pagination';
import {
  CursorPageOptionsDto,
  CursorPaginatedDto,
} from '@/common/dto/cursor-pagination';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user in the database.',
  })
  @ApiStandardResponse({
    status: 201,
    description: 'Created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123' },
        email: { type: 'string', example: 'user@example.com' },
        createdAt: { type: 'string', example: '2025-09-28T16:30:00.000Z' },
        updatedAt: { type: 'string', example: '2025-09-28T16:30:00.000Z' },
      },
    },
  })
  @ApiStandardErrorResponse({
    status: 400,
    description: 'Validation Error',
    errorCode: 'GENERIC_ERROR',
  })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get('/offset')
  @ApiOperation({
    summary: 'Get offset-based paginated users',
    description: 'Fetches users from the database with offset-based pagination',
  })
  @ApiPaginatedResponse(UserDto)
  async getUsersOffset(
    @Query() pageOptionsDto: OffsetPageOptionsDto,
  ): Promise<OffsetPaginatedDto<UserDto>> {
    return this.userService.findAllUsers(pageOptionsDto);
  }

  @Get('/cursor')
  @ApiOperation({
    summary: 'Get cursor-based paginated users',
    description: 'Fetches users from the database with cursor-based pagination',
  })
  @ApiCursorPaginatedResponse(UserDto)
  async getUsersCursor(
    @Query() pageOptionsDto: CursorPageOptionsDto,
  ): Promise<CursorPaginatedDto<UserDto>> {
    return this.userService.findAllUsersWithCursor(pageOptionsDto);
  }

  @Get('/count')
  @ApiOperation({
    summary: 'Get total user count',
    description: 'Returns the total number of users in the database',
  })
  @ApiStandardResponse({
    description: 'Total user count',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Total number of users',
          example: 0,
        },
      },
    },
  })
  async getUserCount(): Promise<{ count: number }> {
    const count = await this.userService.getUserCount();
    return { count };
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Fetches a single user by their unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
  })
  @ApiStandardResponse({
    description: 'User found',
    type: UserDto,
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'User not found',
    errorCode: 'USER_NOT_FOUND',
  })
  async getUserById(@Param('id') id: string): Promise<UserDto | null> {
    return this.userService.findUserById(id);
  }
}
