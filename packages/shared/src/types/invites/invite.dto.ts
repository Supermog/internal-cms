import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  MinLength,
  IsEnum,
} from "class-validator";
import { Database } from "../database/database.types";
import { UserRole } from "../users/user.dto";

export class CreateInviteDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  @IsUUID()
  client_uid?: string;
}

export class AcceptInviteDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;
}

export enum InviteStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  EXPIRED = "expired",
}

// Use the database table type directly
export type Invite = Database["public"]["Tables"]["invites"]["Row"];

// Invite-specific response types
export interface CreateInviteResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;
  client_uid: string | null;
  code: string;
  status: string;
  expires_at: string;
  created_at: string;
  created_by: string;
  accepted_at: string | null;
}

export interface ValidateInviteResponseDto {
  valid: boolean;
  message: string;
}

export interface DeleteInviteResponseDto {
  message: string;
}

export interface GetInvitesByCreatorResponseDto {
  invites: Invite[];
}
