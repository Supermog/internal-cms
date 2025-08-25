import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { supabaseClient } from '../../config/supabase.config';

// Define the user type that will be attached to the request
export interface RequestUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  client_uid?: string | null;
  created_at?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'dummy-secret', // We'll override this in validate method
      passReqToCallback: true,
    });
  }

  public async validate(req: Request): Promise<RequestUser> {
    try {
      // Get the token from the request
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify the token with Supabase
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        });
      }

      // Get the user from our database
      const { data: dbUser, error: dbError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbError || !dbUser) {
        throw new UnauthorizedException({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'User not found in database',
        });
      }

      // Return the user data that will be attached to the request
      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role || undefined,
        client_uid: dbUser.client_uid || undefined,
        created_at: dbUser.created_at,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication failed',
      });
    }
  }
}
