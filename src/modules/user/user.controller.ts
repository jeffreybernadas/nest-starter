import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiStandardErrorResponse,
} from '@/decorators/swagger.decorator';
import { UserProfileDto } from './dto/user-profile.dto';
import { AuthenticatedUser } from 'nest-keycloak-connect';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  @Get('/profile')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieves the authenticated user profile information from the JWT token, including roles and permissions.',
  })
  @ApiStandardResponse({
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiStandardErrorResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    errorCode: 'UNAUTHORIZED',
  })
  getUserProfile(@AuthenticatedUser() user: any): UserProfileDto {
    return {
      sub: user.sub,
      preferred_username: user.preferred_username,
      email: user.email,
      email_verified: user.email_verified,
      given_name: user.given_name,
      family_name: user.family_name,
      name: user.name,
      realm_roles: user.realm_access?.roles,
      client_roles: user.resource_access,
      iat: user.iat,
      exp: user.exp,
      iss: user.iss,
      aud: user.aud,
      session_state: user.session_state,
      azp: user.azp,
      scope: user.scope,
    };
  }
}
