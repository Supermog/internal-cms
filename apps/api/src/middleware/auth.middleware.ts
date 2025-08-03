import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../config/supabase.config';
import { Database, DatabaseUser } from '@internal-cms/shared';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string | null;
    client_uid: string | null;
  };
  supabaseUser: DatabaseUser;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = supabaseClient;
  }

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // For routes that don't require auth, continue without user
        return next();
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify the JWT token with Supabase
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Get additional user data from database
      const { data: databaseUser, error: dbError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single<DatabaseUser>();

      if (!databaseUser || dbError) {
        throw new UnauthorizedException('Authentication failed');
      }

      // Add user info to request
      req.user = {
        id: databaseUser.id,
        email: databaseUser.email,
        role: databaseUser.role,
        client_uid: databaseUser.client_uid,
      };

      req.supabaseUser = databaseUser;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
