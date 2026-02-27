import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: 'user',
    enum: ['user', 'operator', 'admin'],
    description: 'User role',
  })
  role: UserRole;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    example: '+971501234567',
    description: 'User phone number',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  avatarUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Whether account is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether email is verified',
  })
  emailVerified: boolean;

  @ApiProperty({
    example: '2025-01-15T10:30:00Z',
    description: 'Account creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-27T14:30:00Z',
    description: 'Last login timestamp',
    required: false,
  })
  lastLoginAt?: Date;
}
