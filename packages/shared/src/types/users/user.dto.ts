import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
} from "class-validator";
import { Session, User } from "@supabase/supabase-js";

export enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
}

// Define user types based on common patterns
// These will be used until the user tables are added to the database schema
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  client_uid: null;
  role: UserRole.ADMIN;
}

export interface ClientUser {
  id: string;
  email: string;
  name: string;
  client_uid: string;
  created_at: string;
  role: UserRole.CLIENT;
}

export type DatabaseUser = AdminUser | ClientUser;

// DTOs for creating/updating users
export class CreateAdminUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateClientUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  client_uid: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

// DTO for signing in
export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// Auth-specific response types
export interface SignUpResponseDto {
  message: string;
}

export interface AuthenticatedUserResponseDto {
  auth_user: User;
  database_user: DatabaseUser;
}

export interface DeleteUserResponseDto {
  message: string;
}
