import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";

export function generateInviteCode(): string {
  return randomBytes(16).toString("hex").toUpperCase();
}

export function generateUUID(): string {
  return uuidv4();
}

export function isInviteExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}
