import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  MinLength,
} from "class-validator";
import { Database } from "../database/database.types";

export class CreateInviteDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  client_uid?: string;
}

export class ValidateInviteDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
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
