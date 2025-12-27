import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEmail,
  Min,
  IsInt,
  IsEnum,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from "class-validator";
import { Database } from "../database/database.types";
import { Type } from "class-transformer";
import { Constants } from "../database/database.types";
import { isFuture } from "date-fns";

@ValidatorConstraint({ name: "isNotPastDate", async: false })
class IsNotPastDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return true; // Allow empty/undefined dates
    const date = new Date(dateString);
    return isFuture(date);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} cannot be in the past`;
  }
}

function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotPastDateConstraint,
    });
  };
}

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

  @IsEnum(Constants.public.Enums.client_support_level)
  @IsNotEmpty()
  support_level: Database["public"]["Enums"]["client_support_level"];

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
  @ValidateIf(
    (o) => o.support_renewal_date !== undefined && o.support_renewal_date !== ""
  )
  @IsNotPastDate()
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
  @IsEnum(Constants.public.Enums.client_support_level)
  support_level?: Database["public"]["Enums"]["client_support_level"];

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
  @ValidateIf(
    (o) => o.support_renewal_date !== undefined && o.support_renewal_date !== ""
  )
  @IsNotPastDate()
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
