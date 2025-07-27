import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";
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

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

// Use the database table type directly
export type Invite = Database["public"]["Tables"]["invites"]["Row"];
