import { User } from '@supabase/supabase-js';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: Omit<User, 'email'> & { email: string };
}
