import { IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class ManageSupportHoursDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: "Hours must be greater than 0" })
  hours: number;
}

export type ManageSupportHoursAction = "add" | "remove";
