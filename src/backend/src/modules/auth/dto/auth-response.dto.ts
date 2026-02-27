import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'john.doe@example.com',
      role: 'user',
      firstName: 'John',
      lastName: 'Doe',
    },
    description: 'User information',
  })
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  };

  @ApiProperty({
    example: 'Authentication successful. Tokens set in httpOnly cookies.',
    description: 'Success message',
  })
  message: string;
}
