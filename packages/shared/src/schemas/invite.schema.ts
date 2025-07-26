import { z } from "zod";

export const InviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export type InviteData = z.infer<typeof InviteSchema>;
