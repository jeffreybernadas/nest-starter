import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/database.service';
import { UserDto } from '@/modules/user/dto/user.dto';
import { Order } from '@/constants/app.constant';
import {
  cursorPaginateWithPrisma,
  offsetPaginateWithPrisma,
} from '@/utils/pagination/prisma-pagination.util';
import {
  OffsetPageOptionsDto,
  OffsetPaginatedDto,
} from '@/common/dto/offset-pagination';
import {
  CursorPageOptionsDto,
  CursorPaginatedDto,
} from '@/common/dto/cursor-pagination';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAllUsers(
    pageOptionsDto: OffsetPageOptionsDto,
  ): Promise<OffsetPaginatedDto<UserDto>> {
    const orderBy = {
      createdAt: pageOptionsDto.order === Order.Asc ? 'asc' : 'desc',
    } as const;

    const where = pageOptionsDto.search
      ? {
          email: {
            contains: pageOptionsDto.search,
            mode: 'insensitive' as const,
          },
        }
      : undefined;

    return offsetPaginateWithPrisma<
      UserDto,
      NonNullable<Parameters<typeof this.prisma.user.findMany>[0]>
    >(this.prisma.user, pageOptionsDto, {
      where,
      orderBy,
    });
  }

  findAllUsersWithCursor(
    cursorPageOptionsDto: CursorPageOptionsDto,
  ): Promise<CursorPaginatedDto<UserDto>> {
    const orderBy = {
      createdAt: cursorPageOptionsDto.order === Order.Asc ? 'asc' : 'desc',
    } as const;

    const where = cursorPageOptionsDto.search
      ? {
          email: {
            contains: cursorPageOptionsDto.search,
            mode: 'insensitive' as const,
          },
        }
      : undefined;

    return cursorPaginateWithPrisma<
      UserDto,
      NonNullable<Parameters<typeof this.prisma.user.findMany>[0]>
    >(
      this.prisma.user,
      cursorPageOptionsDto,
      {
        where,
        orderBy,
      },
      'id', // Use 'id' as cursor field
    );
  }

  findUserById(id: string): Promise<UserDto | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  getUserCount(): Promise<number> {
    return this.prisma.user.count();
  }
}
