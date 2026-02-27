import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CrmLeadStatus } from '@prisma/client';

export class LeadResponseDto {
  @ApiProperty({ description: 'Lead ID' })
  id: number;

  @ApiProperty({ description: 'Lead full name' })
  name: string;

  @ApiProperty({ description: 'Lead phone number' })
  phone: string;

  @ApiPropertyOptional({ description: 'Lead email address' })
  email?: string | null;

  @ApiProperty({ description: 'Lead status', enum: CrmLeadStatus })
  status: CrmLeadStatus;

  @ApiProperty({ description: 'Is marked as spam' })
  isSpam: boolean;

  @ApiPropertyOptional({ description: 'Warehouse ID of interest' })
  warehouseId?: number | null;

  @ApiPropertyOptional({ description: 'User ID if associated with registered user' })
  userId?: string | null;

  @ApiPropertyOptional({ description: 'Lead source' })
  source?: string | null;

  @ApiPropertyOptional({ description: 'Additional notes' })
  notes?: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Warehouse details if warehouseId is present' })
  warehouse?: {
    id: number;
    name: string;
  } | null;

  @ApiPropertyOptional({ description: 'User details if userId is present' })
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;

  @ApiPropertyOptional({ description: 'Contact history' })
  contacts?: Array<{
    id: number;
    contactType: string;
    initiatedBy: string;
    subject?: string | null;
    createdAt: Date;
  }>;

  @ApiPropertyOptional({ description: 'Activities' })
  activities?: Array<{
    id: number;
    title: string;
    completed: boolean;
    dueDate?: Date | null;
    createdAt: Date;
  }>;

  @ApiPropertyOptional({ description: 'Status change history' })
  statusHistory?: Array<{
    id: number;
    fromStatus?: CrmLeadStatus | null;
    toStatus: CrmLeadStatus;
    reason?: string | null;
    createdAt: Date;
  }>;
}
