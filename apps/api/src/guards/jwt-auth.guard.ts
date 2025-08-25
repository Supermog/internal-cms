import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { supabaseClient } from '../config/supabase.config';

@Injectable()
export class JwtAuthGuard {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify the token with Supabase
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Get the user from our database
      const { data: dbUser, error: dbError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbError || !dbUser) {
        throw new UnauthorizedException('User not found in database');
      }

      // Attach the user to the request
      request.user = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role || undefined,
        client_uid: dbUser.client_uid || undefined,
        created_at: dbUser.created_at,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
