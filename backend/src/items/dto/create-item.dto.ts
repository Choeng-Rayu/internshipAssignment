import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemStatus } from '@prisma/client';

export class CreateItemDto {
  @ApiProperty({
    example: 'My Task',
    description: 'Item title (max 200 characters)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title!: string;

  @ApiProperty({
    example: 'Task description',
    description: 'Item description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @ApiProperty({
    enum: ItemStatus,
    example: 'ACTIVE',
    description: 'Item status',
    required: false,
  })
  @IsEnum(ItemStatus, {
    message: 'Status must be one of: ACTIVE, COMPLETED, ARCHIVED',
  })
  @IsOptional()
  status?: ItemStatus;
}
