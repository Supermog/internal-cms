import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEmail,
  Min,
  IsInt,
} from "class-validator";
import { Database } from "../database/database.types";
import { Type } from "class-transformer";

// Use the database table types directly
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

// DTO for creating a new client
export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  short_name: string;

  @IsString()
  @IsNotEmpty()
  support_level: string;

  @IsEmail()
  @IsNotEmpty()
  key_contact_email: string;

  @IsString()
  @IsNotEmpty()
  key_contact_name: string;

  @IsOptional()
  @IsBoolean()
  is_covered_by_support?: boolean;

  @IsOptional()
  @IsBoolean()
  is_monthly_checked?: boolean;

  @IsOptional()
  @IsBoolean()
  is_proactive_support?: boolean;

  @IsOptional()
  @IsNumber()
  hours_per_month?: number;

  @IsOptional()
  @IsString()
  support_renewal_date?: string;
}

// DTO for updating a client
export class UpdateClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  short_name?: string;

  @IsOptional()
  @IsString()
  support_level?: string;

  @IsOptional()
  @IsEmail()
  key_contact_email?: string;

  @IsOptional()
  @IsString()
  key_contact_name?: string;

  @IsOptional()
  @IsBoolean()
  is_covered_by_support?: boolean;

  @IsOptional()
  @IsBoolean()
  is_monthly_checked?: boolean;

  @IsOptional()
  @IsBoolean()
  is_proactive_support?: boolean;

  @IsOptional()
  @IsNumber()
  hours_per_month?: number;

  @IsOptional()
  @IsString()
  support_renewal_date?: string;
}

export class GetAllClientsQueryDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}
