import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string | null;
        client_uid?: string | null;
      };
      supabaseUser?: any;
    }
  }
}
