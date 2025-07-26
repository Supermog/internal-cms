import { randomBytes } from "crypto";

export function generateInviteCode(): string {
  return randomBytes(16).toString("hex").toUpperCase();
}

export function isInviteExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}
