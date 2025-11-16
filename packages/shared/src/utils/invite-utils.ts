import { v4 as uuidv4 } from "uuid";

export function generateInviteCode(): string {
  const bytes = new Uint8Array(16);
  // Use Web Crypto API available in browsers and modern Node (globalThis.crypto)
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    // Fallback: use Math.random (lower entropy, but avoids bundling node 'crypto' in the browser)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export function generateUUID(): string {
  return uuidv4();
}

export function isInviteExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}
