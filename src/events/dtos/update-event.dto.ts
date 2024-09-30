import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class UpdateEventDto {
  @IsOptional() // This means this field is not required
  @IsString()
  title?: string;

  @IsOptional() // This means this field is not required
  @IsString()
  description?: string;

  @IsOptional() // This means this field is not required
  @IsISO8601() // Validate that it's an ISO 8601 formatted string
  date?: string; // Keep it as a string for initial validation
}
