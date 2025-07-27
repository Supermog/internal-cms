import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
} from "class-validator";

// Define user types based on common patterns
// These will be used until the user tables are added to the database schema
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface ClientUser {
  id: string;
  email: string;
  name: string;
  client_uid: string;
  created_at: string;
}

// Insert types for creating users
export interface AdminUserInsert {
  id?: string;
  email: string;
  name: string;
}

export interface ClientUserInsert {
  id?: string;
  email: string;
  name: string;
  client_uid: string;
}

// Update types for modifying users
export interface AdminUserUpdate {
  id?: string;
  email?: string;
  name?: string;
  created_at?: string;
}

export interface ClientUserUpdate {
  id?: string;
  email?: string;
  name?: string;
  client_uid?: string;
  created_at?: string;
}

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

// Response DTOs
export interface AdminUserResponseDto {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface ClientUserResponseDto {
  id: string;
  email: string;
  name: string;
  client_uid: string;
  created_at: string;
}
