import { Database, Constants } from "../database/database.types";

export type TicketPriority = Database["public"]["Enums"]["ticket_priority"];
export type TicketStatus = Database["public"]["Enums"]["ticket_status"];

/** Enum-like object derived from Database; stays in sync when database.types is regenerated. */
export const TicketPriorityEnum = Object.fromEntries(
  Constants.public.Enums.ticket_priority.map((v) => [v, v])
) as { [K in TicketPriority]: K };

/** Enum-like object derived from Database; stays in sync when database.types is regenerated. */
export const TicketStatusEnum = Object.fromEntries(
  Constants.public.Enums.ticket_status.map((v) => [v, v])
) as { [K in TicketStatus]: K };
