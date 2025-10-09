import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for user profile information from Keycloak
 * Contains decoded JWT token information including user details and roles
 */
export class UserProfileDto {
  @ApiProperty({
    description: 'Unique user identifier from Keycloak',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sub: string;

  @ApiProperty({
    description: 'Username',
    example: 'john.doe',
  })
  preferred_username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Whether email is verified',
    example: true,
  })
  email_verified: boolean;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: false,
  })
  given_name?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: false,
  })
  family_name?: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Realm roles assigned to the user',
    example: ['user', 'admin'],
    type: [String],
    required: false,
  })
  realm_roles?: string[];

  @ApiProperty({
    description: 'Client roles assigned to the user',
    example: { 'nest-starter': ['manage-users', 'view-reports'] },
    required: false,
  })
  client_roles?: Record<string, string[]>;

  @ApiProperty({
    description: 'Token issued at timestamp',
    example: 1609459200,
  })
  iat: number;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: 1609462800,
  })
  exp: number;

  @ApiProperty({
    description: 'Token issuer',
    example: 'http://localhost:8080/realms/my-realm',
  })
  iss: string;

  @ApiProperty({
    description: 'Audience',
    example: 'account',
  })
  aud: string | string[];

  @ApiProperty({
    description: 'Session state',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  session_state?: string;

  @ApiProperty({
    description: 'Authorized party',
    example: 'nest-starter-client',
    required: false,
  })
  azp?: string;

  @ApiProperty({
    description: 'Scope',
    example: 'openid profile email',
    required: false,
  })
  scope?: string;
}
