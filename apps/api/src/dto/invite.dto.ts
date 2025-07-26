import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { InviteStatus } from '../types/database.types';

export class CreateInviteDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
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

export class InviteResponseDto {
  id!: string;
  email!: string;
  code!: string;
  status!: InviteStatus;
  expires_at!: string;
  created_by!: string;
  created_at!: string;
  accepted_at!: string | null;
  user_id!: string | null;
}
